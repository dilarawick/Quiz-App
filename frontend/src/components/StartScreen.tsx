import React from 'react';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-6">
      <div className="bg-white/15 backdrop-blur-xl rounded-3xl shadow-2xl p-10 max-w-md w-full text-center border border-white/25">
        <div className="mb-8">
          <div className="w-24 h-24 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
            <span className="text-4xl">🧠</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">QuizMaster</h1>
          <p className="text-indigo-200 text-lg font-medium">Challenge Your Knowledge</p>
        </div>
        
        <p className="text-gray-100 mb-10 text-xl leading-relaxed">
          Test your knowledge with our fun and interactive quiz!
        </p>
        
        <div className="space-y-5 mb-10">
          <div className="bg-white/15 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-lg">
            <h3 className="font-bold text-white text-lg mb-4 flex items-center justify-center">
              <span className="mr-3 text-xl">✨</span> How it works:
            </h3>
            <ul className="space-y-3 text-left">
              <li className="flex items-center text-gray-100">
                <span className="text-green-400 mr-3 text-xl">✓</span>
                <span>Answer multiple-choice questions</span>
              </li>
              <li className="flex items-center text-gray-100">
                <span className="text-green-400 mr-3 text-xl">✓</span>
                <span>Track your score in real-time</span>
              </li>
              <li className="flex items-center text-gray-100">
                <span className="text-green-400 mr-3 text-xl">✓</span>
                <span>Compete against yourself!</span>
              </li>
            </ul>
          </div>
        </div>
        
        <button
          onClick={onStart}
          className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 text-white font-bold py-5 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95 shadow-lg text-lg"
        >
          <span className="flex items-center justify-center">
            Start Quiz <span className="ml-3 text-xl">→</span>
          </span>
        </button>
        
        <div className="mt-8 pt-6 border-t border-white/20">
          <p className="text-sm text-gray-300 font-light">Powered by Open Trivia Database</p>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;