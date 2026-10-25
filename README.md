# ABC & 123 Adventure

A colorful kids learning game built with React and Vite.

This app helps children learn:
- English letters A to Z
- Numbers 1 to 100
- Matching words with picture concepts
- Quiz-based learning and recall practice
- Points, stars, and level progression

## Features
- Learning mode for letters and numbers
- Large kid-friendly display cards
- Emoji picture cards for each item
- Sound effects and music
- Browser speech narration
- Mini quiz mode
- Score, stars, streaks, and level badges
- Responsive layout for mobile and desktop

## Tech Stack
- React
- Vite
- JavaScript
- Netlify deployment

## Project Structure

```bash
.
├── index.html
├── package.json
├── vite.config.js
├── netlify.toml
├── .gitignore
├── src/
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
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
- Branch to deploy: `main`
- Base directory: `.`
- Build command: `npm run build`
- Publish directory: `dist`

## Notes

### Speech/Voice
This app uses the browser's built-in speech synthesis API.
That means voice quality depends on the user's browser and device.
For more realistic child-like narration, a cloud text-to-speech service such as ElevenLabs, Azure Speech, or Google Cloud TTS would be recommended.

### Browser support
The app is designed for modern browsers and works well on desktop and mobile.

## License
This project is for educational/demo purposes.

## Author
Created as a kids learning game demo.
