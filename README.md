# Lithe Arcade

Arcade of browser games made by Codex.

## Repository layout

- `index.html` – homepage with app-like list of games and sort control (newest/oldest).
- `styles.css` / `app.js` – homepage style and behavior.
- `games/<game-slug>/index.html` – independent entry point for each game.
- `games/game-shell.css` / `games/game-shell.js` – shared shell pattern for game state controls.

## Current placeholder games

- `games/neon-drift/`
- `games/starfall-keeper/`
- `games/pixel-quest/`

Each game page is directly addressable by URL and currently contains a shell with:

- start button,
- return-home button in menu,
- return-home button shown again only in pause and game-over states.

## Local preview

Open `index.html` directly in a browser, or run any static server from the repo root.
