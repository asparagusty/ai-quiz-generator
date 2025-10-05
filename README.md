AI-Assisted Knowledge Quiz

🚀 Project Setup & Demo

Web Demo: https://ai-quiz-generator-38d4fhznj-ayushika-agarwals-projects.vercel.app?_vercel_share=J4nsJH1dlnVnsc7wRDgHcNyyry9MW5M0
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

The app will open at http://localhost:5173

🎯 Problem Understanding

Create an AI-powered quiz application that:

Allows users to select from various topics

Uses AI to generate 5 multiple-choice questions per topic

Provides an interactive quiz experience with navigation

Generates custom AI feedback based on user performance

**Assumptions Made**

Users have stable internet connection for AI API calls

Fallback questions provided if AI service is unavailable

Mobile-responsive design for cross-device compatibility

JSON parsing from AI responses requires error handling

**🤖 AI Prompts & Iterations**

Initial Prompt (V1)


"Generate 5 multiple choice questions about React"

Issues: Inconsistent format, no JSON structure, mixed response types

**Refined Prompt (V2)**


"Generate exactly 5 multiple-choice questions about ${topic}. 

Each question should have 4 options and one correct answer.

Return ONLY valid JSON in this format:
{
  'questions': [
    {
      'question': 'Question text?',
      'options': ['A', 'B', 'C', 'D'],
      'answer': 'Correct Answer'
    }
  ]
}"

Final Prompt 
text
"Create 3 multiple choice quiz questions about ${topic}. 
Each question should have 4 options and indicate the correct answer.
Format: 

Q1. Question? 
A) Option1 B) Option2 C) Option3 D) Option4 
Answer: A

Q2. Next question? 
A) Option1 B) Option2 C) Option3 D) Option4 
Answer: B"
Challenges & Solutions
JSON Parsing Issues: Added robust error handling with fallback questions

API Rate Limits: Implemented loading states and graceful degradation

Response Consistency: Used strict formatting requirements in prompts

🏗️ Architecture & Code Structure
File Structure
text
src/
├── App.jsx                 # Main application component
├── main.jsx               # Application entry point
├── index.css              # Global styles with Tailwind
└── components/            # (Potential expansion)
State Management
React Hooks: useState for local component state

Context: Not implemented (kept simple for this scope)

State Flow:

screen: Manages current view (topic → loading → quiz → result)

questions: Stores AI-generated quiz questions

currentQ: Tracks current question index

score: Accumulates user score

AI Service Integration
javascript
// Hugging Face Inference API

const hf = new HfInference(import.meta.env.VITE_HUGGING_FACE_API_KEY);

const response = await hf.textGeneration({
  model: "microsoft/DialoGPT-medium",
  inputs: prompt,
  parameters: { max_new_tokens: 500, temperature: 0.7 }
});
Key Components

Topic Selection Screen: Grid of topic buttons

Loading Screen: Animated spinner with fun facts

Quiz Screen: Question display with option buttons

Result Screen: Score display with AI-generated feedback

📱 Screenshots

Screen 1: Topic Selection
<img width="1848" height="891" alt="Screenshot 2025-10-04 223112" src="https://github.com/user-attachments/assets/87cb2933-dd92-495c-85d4-347a3a88ff2d" />


Clean grid layout with topic options

Dark/light mode toggle

Responsive design

Screen 2: AI Generation Loading
<img width="1604" height="846" alt="Screenshot 2025-10-04 222950" src="https://github.com/user-attachments/assets/cddfdbd2-2417-40eb-819b-3045dfb21cde" />


Animated spinner

Fun facts display

AI status updates

Screen 3: Quiz Interface
<img width="1828" height="876" alt="Screenshot 2025-10-04 223033" src="https://github.com/user-attachments/assets/03d6785f-b5d4-4b32-974b-4a3ee89669d9" />


Progress indicator

Question and options

Score tracking

Screen 4: Results & Feedback
<img width="1861" height="894" alt="Screenshot 2025-10-04 222825" src="https://github.com/user-attachments/assets/7ae1a4d5-f0c8-4b58-8602-d75fab0902e6" />


Score display

AI-generated feedback message

Retry options

🐛 Known Issues & Improvements

AI Dependency: Requires Hugging Face API key

Question Count: Fixed at 3-5 questions per quiz

Error Handling: Basic fallback without retry mechanism

No Persistence: Scores not saved between sessions

Planned Improvements

Enhanced AI Integration

Multiple AI provider fallbacks (OpenAI, Anthropic)

Better prompt engineering for consistent JSON

Caching generated questions

User Experience

Question difficulty levels

Timer functionality

Progress saving

Social sharing of scores

Technical Enhancements

Proper TypeScript implementation

Unit and integration tests

PWA capabilities for offline use

Advanced analytics

✨ Bonus Features Implemented

Dark/Light Mode: Full theme switching with smooth transitions

Responsive Design: Mobile-first approach with Tailwind CSS

Loading States: Animated spinners with educational fun facts

Error Handling: Graceful fallbacks with user-friendly messages

Accessibility: Proper contrast ratios and focus states

UI/UX Features

Smooth Animations: CSS transitions for all interactive elements

Visual Feedback: Hover states and loading indicators

Progress Tracking: Real-time score and question progress

Custom Feedback: AI-generated personalized result messages

🛠️ Technical Stack

Frontend: React 18 + Vite

Styling: Tailwind CSS

AI Service: Hugging Face Inference API

Deployment: Vercel + GitHub

State Management: React Hooks

📦 Environment Variables

env

VITE_HUGGING_FACE_API_KEY=your_hugging_face_token_here

**🚀 Deployment**

The application is automatically deployed via Vercel with continuous integration from the GitHub repository. Any push to the main branch triggers a new deployment.




