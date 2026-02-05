import React, { useState } from 'react';
import QuizPage from './components/QuizPage';
import StartScreen from './components/StartScreen';

const App: React.FC = () => {
  const [started, setStarted] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {!started ? (
        <StartScreen onStart={() => setStarted(true)} />
      ) : (
        <QuizPage onExit={() => setStarted(false)} />
      )}
    </div>
  );
};

export default App;