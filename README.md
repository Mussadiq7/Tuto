# Tuto - AI-Powered Learning Platform

Revolutionize learning with our AI-powered tutor. Generate personalized study plans, quizzes, and flashcards personalized to you.

<!-- Badges -->
<p align="left">
  <img alt="Status" src="https://img.shields.io/badge/status-active-success" />
  <img alt="Built with" src="https://img.shields.io/badge/built%20with-HTML%2FCSS%2FJS-orange" />
  <img alt="PRs welcome" src="https://img.shields.io/badge/PRs-welcome-brightgreen" />
</p>

## Features

### 🏠 Home Page
- Clean, modern interface with AI-powered topic input
- Generate personalized study plans
- Responsive design with dark/light theme support
- Custom fonts (Bespoke Stencil & Supreme)

### 📊 Learning Dashboard
- **Progress Tracking**: Visual charts showing study time and progress over time
- **Quick Stats**: Total study time, completed topics, quiz scores, and next sessions
- **Study Streaks**: Track consecutive days of learning with visual indicators
- **Current Study Plan**: View and manage ongoing learning topics
- **Quick Actions**: Start new topics, take quizzes, review notes, schedule sessions
- **Recent Activity**: Timeline of learning activities and achievements
- **Learning Goals**: Track progress on upcoming learning objectives
- **Interactive Charts**: Chart.js integration for data visualization
- **Theme Toggle**: Seamless dark/light mode switching
- **Responsive Design**: Works perfectly on all device sizes

### 📝 Study Plan Creator
- Customizable learning parameters
- Time management settings
- Learning style preferences
- Goal-oriented planning

### 📚 All Study Plans
- Comprehensive view of all study plans (completed, active, planning)
- Advanced filtering by status, category, and difficulty
- Real-time search functionality
- Start learning directly from any plan
- Progress tracking and visual indicators

### 🎓 Learning Interface
- **Interactive Lessons**: Rich content with code examples, explanations, and visual elements
- **Progress Tracking**: Real-time progress updates and completion status
- **Lesson Navigation**: Easy navigation between lessons with visual progress indicators
- **Quiz System**: Interactive quizzes to test knowledge and reinforce learning
- **Keyboard Shortcuts**: Navigate efficiently with arrow keys and spacebar
- **Responsive Design**: Optimized for all device sizes
- **Theme Consistency**: Maintains the same theme across all pages

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Tailwind CSS with custom CSS variables
- **Charts**: Chart.js for data visualization
- **Fonts**: Bespoke Stencil (branding), Supreme (body text)
- **Icons**: Heroicons and custom SVG icons

## Environment Setup

This project reads API keys from a client-side environment file that is not committed to git.

1) Copy `env.example.js` to `env.js` in the project root.

```bash
cp env.example.js env.js
```

2) Open `env.js` and fill in your provider keys:

```js
window.ENV = {
  GROQ_API_KEY: "your-groq-key",
  OPENAI_API_KEY: "",
  ANTHROPIC_API_KEY: "",
  AZURE_OPENAI_API_KEY: "",
  LOCAL_AI_API_KEY: ""
};
```

## Getting Started

1. Clone the repository
2. Open `index.html` in your browser
3. Navigate to the dashboard to explore learning features
4. Create personalized study plans

## Security Notes

- Do not commit real API keys. `env.js` is listed in `.gitignore`.
- `config.js` now reads keys from `window.ENV` and contains no secrets.
- For public deployments, route AI calls through a backend to avoid exposing keys in the browser.

Inspired from https://github.com/lalitm1004/cogito-tutor.git

© 2024 Tuto. Empowering learners with AI-driven education.


