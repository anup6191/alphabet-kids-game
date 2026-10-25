# ABC & 123 Adventure

A playful educational game for young learners to explore letters, numbers, words, and quiz challenges in a colorful and engaging way.

## Overview
ABC & 123 Adventure is a kid-friendly learning app designed to help children:
- recognize letters from A to Z
- learn numbers and counting basics
- connect letters and numbers to words and meanings
- practice through mini quiz challenges
- build confidence with score, stars, streaks, and levels

The app is built with React and Vite and is ready for deployment on Netlify.

## Demo / Screenshots

Add screenshots here to showcase the app:

```md
![Main learning screen](./assets/demo-learning-screen.png)
![Quiz mode](./assets/demo-quiz-mode.png)
![Progress and level badge](./assets/demo-progress.png)
```

If you want to add real visuals later, place images in an `assets/` folder and reference them above.

## How to Play
1. Open the app in the browser.
2. Choose between the Letter mode and Number mode.
3. Tap or click a letter/number card to hear the spoken word and see the matching emoji.
4. Switch to the Mini Quiz mode to test recall.
5. Earn stars and points for correct answers.
6. Unlock higher levels as progress grows.

## Features
- Letter learning mode for A–Z
- Number learning mode
- Rich emoji-based visual learning
- Sound effects and background music
- Browser-based voice narration
- Quiz challenge mode
- Progress tracking with points and badges
- Responsive design for desktop and mobile
- Keyboard support for quick gameplay

## Tech Stack
- React
- Vite
- JavaScript
- CSS for design and animations
- Netlify deployment

## Project Structure

```bash
.
├── index.html
├── package.json
├── vite.config.js
├── netlify.toml
├── .gitignore
├── README.md
├── src/
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── public/
└── dist/
```

## Getting Started

### Install dependencies

```bash
npm install
```

### Run locally

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## Netlify Deployment

Use these settings in Netlify:
- Branch: `main`
- Base directory: `.`
- Build command: `npm run build`
- Publish directory: `dist`

## Voice / Audio Note
This app currently uses the browser's built-in speech synthesis API for narration.

Important:
- Voice quality depends on the visitor's browser and device.
- It may sound friendly and natural, but it is not a true real-human child voice.
- For a truly lifelike child narrator, a real AI text-to-speech service such as ElevenLabs, Azure Speech, Google Cloud TTS, or Amazon Polly would be recommended.

## Project Status
This project is an educational demo and front-end learning app.
It is ready for further enhancements such as:
- more advanced lesson flow
- persistent score tracking
- parent dashboard and analytics
- more realistic AI voice integration
- richer classroom-style learning modes

## License
This project is intended for educational and demo use.

## Author
Created for kids learning and educational gameplay demonstration.
