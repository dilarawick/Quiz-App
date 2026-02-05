import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Question {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  answers?: string[];
}

interface QuizPageProps {
  onExit: () => void;
}

const QuizPage: React.FC<QuizPageProps> = ({ onExit }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch a new session token when component mounts
  useEffect(() => {
    const fetchSessionToken = async () => {
      try {
        const response = await axios.post('/api/quiz/session');
        setSessionId(response.data.sessionId);
      } catch (err) {
        console.error('Error creating session:', err);
        setError('Failed to initialize quiz. Please try again.');
      }
    };

    fetchSessionToken();
  }, []);

  // Fetch questions after getting session token
  useEffect(() => {
    if (sessionId) {
      const fetchQuestions = async () => {
        try {
          const response = await axios.get(`/api/quiz/questions?amount=5&sessionId=${sessionId}`);
          
          if (response.data.response_code === 0) {
            // Shuffle answers for each question
            const shuffledQuestions = response.data.results.map((q: Question) => ({
              ...q,
              answers: shuffleAnswers([...q.incorrect_answers, q.correct_answer])
            }));
            
            setQuestions(shuffledQuestions.map((q: Question) => ({
              ...q,
              answers: undefined // We'll use the combined answers array directly
            })));
            setIsLoading(false);
          } else if (response.data.response_code === 4) {
            // Token empty, reset it
            await axios.put('/api/quiz/session/reset', { sessionId });
            setError('Need to reset session. Please restart the quiz.');
          } else {
            setError('Failed to load questions. Please try again.');
          }
        } catch (err) {
          console.error('Error fetching questions:', err);
          setError('Failed to load questions. Please try again.');
        }
      };

      fetchQuestions();
    }
  }, [sessionId]);

  // Function to decode HTML entities
  const decodeHtmlEntities = (text: string): string => {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
  };

  // Function to shuffle answers
  const shuffleAnswers = (answers: string[]): string[] => {
    return answers
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  };

  // Handle answer selection
  const handleAnswerSelect = (answer: string) => {
    if (selectedAnswer) return; // Prevent changing answer after selection
    
    setSelectedAnswer(answer);
    
    // Check if answer is correct
    const isCorrect = questions[currentQuestionIndex].correct_answer === answer;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    // Move to next question after delay
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
      }
    }, 1000);
  };

  // Restart quiz
  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setIsLoading(true);
    
    // Get new session token
    axios.post('/api/quiz/session')
      .then(response => {
        setSessionId(response.data.sessionId);
      })
      .catch(err => {
        console.error('Error creating session:', err);
        setError('Failed to restart quiz. Please try again.');
      });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border border-white/20">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">❌</span>
          </div>
          <h2 className="text-2xl font-bold text-red-400 mb-4">Something Went Wrong</h2>
          <p className="text-gray-200 mb-8">{error}</p>
          <div className="flex space-x-4 justify-center">
            <button
              onClick={onExit}
              className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border border-white/20">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <span className="text-3xl">🧠</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Loading Quiz...</h2>
          <div className="flex justify-center mb-6">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-400"></div>
          </div>
          <p className="text-indigo-200">Preparing your questions...</p>
          <div className="mt-6 w-full bg-white/10 rounded-full h-2">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full animate-pulse" style={{width: '70%'}}></div>
          </div>
        </div>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-6">
        <div className="bg-white/15 backdrop-blur-xl rounded-3xl shadow-2xl p-10 max-w-md w-full text-center border border-white/25">
          <div className="w-28 h-28 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
            <span className="text-5xl">
              {score === questions.length ? '🏆' : score >= questions.length / 2 ? '⭐' : '💪'}
            </span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-6 tracking-tight">Quiz Completed!</h2>
          <div className="text-7xl font-extrabold mb-8 bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 bg-clip-text text-transparent">
            {score}/{questions.length}
          </div>
          <p className="text-2xl text-gray-100 mb-10 font-medium">
            {score === questions.length 
              ? 'Perfect score! 🎉' 
              : score >= questions.length / 2 
                ? 'Good job! 👍' 
                : 'Keep practicing! 💪'}
          </p>
          <div className="flex flex-col space-y-4">
            <button
              onClick={restartQuiz}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95 shadow-lg"
            >
              Play Again
            </button>
            <button
              onClick={onExit}
              className="w-full bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95 shadow-lg"
            >
              Exit to Home
            </button>
          </div>
          <div className="mt-10 pt-6 border-t border-white/15">
            <p className="text-sm text-gray-300 font-light">Powered by Open Trivia Database</p>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border border-white/20">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">❓</span>
          </div>
          <h2 className="text-2xl font-bold text-red-400 mb-4">No Questions</h2>
          <p className="text-gray-200 mb-8">Could not load any questions. Please try again.</p>
          <button
            onClick={onExit}
            className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const allAnswers = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="bg-white/15 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-8 border border-white/25">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">{score}</span>
              </div>
              <div>
                <div className="text-white font-bold text-lg">Your Score</div>
                <div className="text-indigo-200 text-sm font-medium">Keep going!</div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-white">
                {currentQuestionIndex + 1}/{questions.length}
              </div>
              <div className="text-indigo-200 text-sm font-medium">Questions</div>
            </div>
            
            <button
              onClick={onExit}
              className="bg-white/15 hover:bg-white/25 text-white px-5 py-3 rounded-xl transition-all duration-300 border border-white/20 font-medium shadow-lg"
            >
              Exit
            </button>
          </div>
        </div>

        {/* Progress bar and Question */}
        <div className="bg-white/15 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-8 border border-white/25">
          <div className="mb-8">
            <div className="flex justify-between text-white mb-4">
              <span className="font-bold text-lg">Progress</span>
              <span className="font-bold text-lg">{Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%</span>
            </div>
            <div className="w-full bg-white/15 rounded-full h-4 shadow-inner">
              <div
                className="bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500 h-4 rounded-full transition-all duration-700 ease-out shadow-md"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 leading-relaxed">
              {decodeHtmlEntities(decodeURIComponent(currentQuestion.question))}
            </h2>
            
            <div className="space-y-4">
              {allAnswers.map((answer: string, index: number) => {
                let answerStyle = "w-full text-left p-5 rounded-2xl border cursor-pointer transition-all duration-300 shadow-sm";
                
                if (selectedAnswer) {
                  if (answer === currentQuestion.correct_answer) {
                    answerStyle += " bg-green-500/25 border-green-400/60 text-green-200 shadow-green-500/20";
                  } else if (answer === selectedAnswer && answer !== currentQuestion.correct_answer) {
                    answerStyle += " bg-red-500/25 border-red-400/60 text-red-200 shadow-red-500/20";
                  } else {
                    answerStyle += " bg-white/10 border-white/15 text-gray-200";
                  }
                } else {
                  answerStyle += " bg-white/15 border-white/25 text-white hover:bg-white/25 hover:border-white/40 hover:shadow-md";
                }
                
                return (
                  <div
                    key={index}
                    className={answerStyle}
                    onClick={() => !selectedAnswer && handleAnswerSelect(answer)}
                  >
                    <span className="flex items-center">
                      <span className="mr-4 text-xl font-bold bg-white/20 w-10 h-10 rounded-full flex items-center justify-center">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="text-lg leading-relaxed">
                        {decodeHtmlEntities(decodeURIComponent(answer))}
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected answer feedback */}
          {selectedAnswer && (
            <div className={`bg-white/15 backdrop-blur-xl rounded-2xl p-6 border-2 ${
              selectedAnswer === currentQuestion.correct_answer 
                ? 'border-green-400/60 bg-green-500/15 text-green-200 shadow-green-500/20' 
                : 'border-red-400/60 bg-red-500/15 text-red-200 shadow-red-500/20'
            }`}>
              <div className="flex items-center">
                <span className="text-3xl mr-4">
                  {selectedAnswer === currentQuestion.correct_answer ? '✅' : '❌'}
                </span>
                <span className="text-lg font-medium">
                  {selectedAnswer === currentQuestion.correct_answer 
                    ? 'Correct! Well done.' 
                    : `Incorrect. The correct answer is: ${decodeHtmlEntities(decodeURIComponent(currentQuestion.correct_answer))}`}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;