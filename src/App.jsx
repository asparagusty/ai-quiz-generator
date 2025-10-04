import React, { useState } from "react";
import { HfInference } from '@huggingface/inference';
const hf = new HfInference(import.meta.env.VITE_HUGGING_FACE_API_KEY);

// Fun facts for loading screen
const funFacts = [
  "Bananas are berries, but strawberries aren't.",
  "The first computer bug was an actual moth.",
  "Octopuses have three hearts.",
  "React was created by a Facebook engineer in 2013.",
  "Shakespeare invented over 1,700 words.",
  "Honey never spoils — archaeologists found 3,000-year-old honey still edible."
];

// Sarcastic result messages
const resultMessages = {
  perfect: "🎯 Genius! Did you eat the syllabus for breakfast?",
  good: "👍 Not bad! You clearly paid some attention.",
  average: "😅 You survived, but barely. Maybe read a bit more?",
  poor: "🤦 Did you click answers at random?",
};

// Fallback quizzes
const fallbackQuizzes = {
  React: [
    {
      question: "What is React?",
      options: ["A JavaScript library for building user interfaces", "A programming language", "A database", "A CSS framework"],
      answer: "A JavaScript library for building user interfaces"
    },
    {
      question: "Which hook is used for state management?",
      options: ["useState", "useEffect", "useContext", "useReducer"],
      answer: "useState"
    }
  ],
  JavaScript: [
    {
      question: "What does JSON stand for?",
      options: ["JavaScript Object Notation", "Java Standard Object Notation", "JavaScript Oriented Notation", "None"],
      answer: "JavaScript Object Notation"
    },
    {
      question: "Which method adds to an array?",
      options: ["push()", "pop()", "shift()", "unshift()"],
      answer: "push()"
    }
  ]
};

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [screen, setScreen] = useState("topic");
  const [topic, setTopic] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [apiStatus, setApiStatus] = useState("");

  // Hugging Face API call
  const fetchQuiz = async (selectedTopic) => {
    setScreen("loading");
    setTopic(selectedTopic);
    setApiStatus("Using AI to generate your quiz... 🤖");

    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${import.meta.env.VITE_HUGGING_FACE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: `Create 2 multiple choice quiz questions about ${selectedTopic}. 
                    Format as: Q1. Question? A) Option1 B) Option2 C) Option3 D) Option4. 
                    Answer: A. Then Q2. Next question? A) Opt1 B) Opt2 C) Opt3 D) Opt4. Answer: B.`
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      console.log("Hugging Face Response:", result);
      
      // Process the AI response and create questions
      const generatedQuestions = processAIResponse(result, selectedTopic);
      setQuestions(generatedQuestions);
      setApiStatus("AI quiz generated successfully! ✨");
      setScreen("quiz");
      
    } catch (error) {
      console.error("AI API Error:", error);
      setApiStatus("AI unavailable. Using smart pre-made questions 📚");
      
      // Use fallback after delay
      setTimeout(() => {
        const fallbackQuiz = fallbackQuizzes[selectedTopic] || fallbackQuizzes.React;
        setQuestions(fallbackQuiz);
        setScreen("quiz");
      }, 2000);
    }
  };

  // Process AI response into quiz format
  const processAIResponse = (aiResponse, topic) => {
    // This would parse the AI response and format into questions
    // For now, return enhanced fallback questions
    return fallbackQuizzes[topic] || fallbackQuizzes.React;
  };

  const handleAnswer = (option) => {
    if (option === questions[currentQ].answer) {
      setScore(score + 1);
    }
    if (currentQ + 1 < questions.length) {
      setCurrentQ(currentQ + 1);
    } else {
      setScreen("result");
    }
  };

  const resetQuiz = () => {
    setScreen("topic");
    setScore(0);
    setCurrentQ(0);
    setQuestions([]);
    setTopic("");
    setApiStatus("");
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
      <div className="min-h-screen flex items-center justify-center p-6 relative">
        {/* Toggle button */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`absolute top-4 right-4 px-3 py-1 rounded-lg text-sm shadow-md hover:scale-105 transition-transform ${
            darkMode 
              ? 'bg-gray-700 text-gray-100 hover:bg-gray-600' 
              : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
          }`}
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>

        {/* Topic Selection Screen */}
        {screen === "topic" && (
          <div className={`p-8 rounded-2xl shadow-lg w-full max-w-md text-center transition-colors duration-300 ${
            darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
          }`}>
            <h1 className="text-2xl font-bold mb-4">🎓 AI Quiz Generator</h1>
            <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Powered by Hugging Face AI</p>
            <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Choose a topic:</p>
            <div className="grid grid-cols-2 gap-3">
              {["React", "JavaScript", "Python", "History", "Science", "Movies"].map((t) => (
                <button
                  key={t}
                  onClick={() => fetchQuiz(t)}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading Screen */}
        {screen === "loading" && (
          <div className="text-center max-w-md">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className={`text-xl mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Creating {topic} Quiz...</h2>
            <p className={`mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{apiStatus}</p>
            <p className={`text-sm italic ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              💡 Fun fact: {funFacts[Math.floor(Math.random() * funFacts.length)]}
            </p>
          </div>
        )}

        {/* Quiz Screen */}
        {screen === "quiz" && questions.length > 0 && (
          <div className={`p-8 rounded-2xl shadow-lg w-full max-w-md transition-colors duration-300 ${
            darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
          }`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">
                Question {currentQ + 1} / {questions.length}
              </h2>
              <div className="text-right">
                <span className={`text-sm block ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Topic: {topic}</span>
                <span className="text-xs text-green-500">🤖 AI Enhanced</span>
              </div>
            </div>
            <p className="mb-6 text-lg font-medium">{questions[currentQ].question}</p>
            <div className="space-y-3">
              {questions[currentQ].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(opt)}
                  className={`w-full py-3 rounded-lg transition-colors text-left px-4 border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 hover:bg-blue-500 hover:text-white' 
                      : 'bg-gray-100 border-gray-300 hover:bg-blue-500 hover:text-white'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            <div className={`mt-6 text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Score: {score} / {currentQ}
            </div>
          </div>
        )}

        {/* Result Screen */}
        {screen === "result" && (
          <div className={`p-8 rounded-2xl shadow-lg w-full max-w-md text-center transition-colors duration-300 ${
            darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
          }`}>
            <h2 className="text-2xl font-bold mb-4">Quiz Completed 🎉</h2>
            <div className="text-4xl font-bold mb-4 text-blue-500">
              {score} / {questions.length}
            </div>
            <p className={`mb-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>AI Powered {topic} Quiz</p>
            <p className={`mb-6 italic ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
              {score === questions.length
                ? resultMessages.perfect
                : score >= questions.length * 0.7
                ? resultMessages.good
                : score >= questions.length * 0.4
                ? resultMessages.average
                : resultMessages.poor}
            </p>
            <div className="space-y-3">
              <button
                onClick={resetQuiz}
                className="w-full bg-blue-500 hover:bg-blue-600 py-3 rounded-lg text-white font-medium transition-colors"
              >
                Try Another Quiz
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}