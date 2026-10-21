# Little Café

A coffee shop rush game in React. Customers come in with a ticket, you build the drink, and you race the timer.

## Run it

```bash
npm install
npm run dev
```

Open the address Vite prints (usually http://localhost:5173).

Other commands: `npm run build` (makes the `dist/` folder), `npm run preview` (serves the build).

## Files

- `src/main.jsx` starts React
- `src/App.jsx` awning + shop
- `src/Shop.jsx` game state and UI
- `src/Cup.jsx` the SVG cup
- `src/Face.jsx` customer avatars
- `src/Board.jsx` leaderboard (saved in localStorage)
- `src/game.js` grading, pricing, customer generation, game clock
- `src/data.js` menu items and colors
- `src/index.css` all styles
