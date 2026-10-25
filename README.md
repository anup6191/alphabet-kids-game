# ABC & 123 Adventure

A playful educational game for young learners to explore letters, numbers, words, and quiz challenges in a colorful and engaging way.

## Overview
ABC & 123 Adventure is a kid-friendly learning app designed to help children:
- recognize letters from A to Z
- learn numbers 1 to 20 and practice counting
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
3. Tap or click a letter/number card (or press its key) to start a lesson. In Letter mode it runs in three steps:
   1. The letter appears and the narrator says **"A for…"**
   2. The picture appears and the narrator says **"Apple"**
   3. The phonics sound plays: **"a… a… a…"** (the short sound, as in *apple*)

   With sound muted, the same steps still play on screen.
4. Switch to the Mini Quiz to test recall:
   - **Letters:** a big letter appears — pick the picture whose word starts with it.
   - **Numbers:** count the pictures and pick the right number.
5. Earn stars and points for correct answers. A wrong pick is marked so the child can try again.
6. Unlock higher levels as progress grows. Progress is saved in the browser, and **Start over** resets it.

### Keyboard controls
| Key | Learn mode | Mini Quiz |
| --- | --- | --- |
| `A`–`Z` | Show a letter (Letter mode) | — |
| `1`–`9` | Show a number (Number mode) | Pick answer 1–4 |
| `Space` | Switch Letters / Numbers | Switch Letters / Numbers |

## Features
- Letter learning mode for A–Z
- Number learning mode
- Rich emoji-based visual learning
- Sound effects and optional background music (separate toggle, off by default)
- Browser-based voice narration with Natural, Soft and Cheerful styles
- Quiz challenge mode with letter recognition and counting questions
- Progress tracking with points, stars, streaks and level-up celebrations
- Progress and settings saved in the browser (localStorage)
- Responsive design for desktop and mobile
- Keyboard support for quick gameplay
- Accessible controls (visible focus, pressed states, reduced-motion support)

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
└── src/
    ├── App.jsx
    ├── App.css
    └── main.jsx
```

`npm run build` writes the production site to `dist/` (git-ignored).

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
- parent dashboard and analytics
- more realistic AI voice integration
- richer classroom-style learning modes

## License
This project is intended for educational and demo use.

## Author
Created for kids learning and educational gameplay demonstration.
