# React Quiz Player

A modern, responsive Quiz Player application built with React, Vite, Tailwind CSS, and Firebase. This project features multiple quizzes, state-managed timers, dynamic question/option shuffling, smooth animations using Framer Motion, and a Firebase-powered leaderboard.

## Features

- **Quiz Listing**: Browse available quizzes with details on difficulty, time, and category.
- **Interactive Quiz Player**:
  - Live progress bar and countdown timer.
  - Auto-advance when time runs out.
  - Shuffled questions and options for a dynamic experience.
  - Keyboard navigation support.
- **Smooth Animations**: Page and question transitions powered by Framer Motion.
- **Result Screen**: Detailed breakdown of score and performance with confetti celebration for high scores.
- **Global Leaderboard**: Save your scores and view the top 10 players for each quiz (powered by Firebase).

## Tech Stack

- React.js (Vite)
- Tailwind CSS
- React Router
- Framer Motion
- Firebase Firestore
- canvas-confetti

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd job-qies
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Firebase:**
   - Create a project on [Firebase Console](https://console.firebase.google.com/).
   - Set up a Firestore Database.
   - Go to `src/firebase.js` and replace the placeholder `firebaseConfig` object with your actual Firebase project configuration.

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

## AI Usage

- **AI Tools Used**: Claude / Gemini (via Antigravity)
- **Where AI Helped**: 
  - Structuring the initial boilerplate and component architecture.
  - Implementing robust timer logic in the `QuizPlayer` component to prevent re-render drift.
  - Setting up Framer Motion animations for smooth transitions.
  - Generating sample `quiz.json` data.
- **What I Implemented Myself**:
  - Overall project architecture and context API design.
  - Styling refinements and ensuring responsiveness across devices.
  - Firebase integration for the leaderboard system.
  - Connecting and refining the core quiz logic (shuffling, state management).
