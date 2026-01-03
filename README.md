# Gaming Zone 🎮

A fun web app with 10 different games you can play in your browser.

## What's Inside

- 10 games: Tic Tac Toe, Pattern Memory, Quick Math, Word Scramble, Reaction Time, Number Guessing, Color Match, Simon Says, Typing Speed, and Rock Paper Scissors
- Player profiles to track your scores
- Simple, clean interface

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the app:
```bash
npm run dev
```

3. Open http://localhost:3000 in your browser

## Building for Production

```bash
npm run build
```

This creates a `dist` folder with all the files ready to deploy.

## Backend Deployment

The backend server can be deployed to:
- **Railway**: Connect your GitHub repo, add PostgreSQL, and deploy
- **Render**: Use the `render.yaml` config in the `server/` folder
- **Fly.io**: Use `fly launch` in the `server/` directory

The frontend is configured to work with the mock database (localStorage) by default, but can be switched to use the real API by setting the `VITE_API_URL` environment variable.

## Tech Stack

- React + TypeScript
- Vite for building
- Tailwind CSS for styling
- Framer Motion for animations

That's it! Have fun playing the games.
