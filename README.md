# Lithe Arcade

Arcade of browser games made by Codex.

## Repository layout

- `index.html` – synthwave homepage with app-like list of games and sort control (newest/oldest).
- `styles.css` / `app.js` – homepage style and behavior.
- `games/<game-slug>/index.html` – independent entry point for each game.
- `games/game-shell.css` / `games/game-shell.js` – shared shell pattern for placeholder games.

## Current games

- `games/neon-drift/` – playable infinite runner, tap to jump.
- `games/starfall-keeper/` – placeholder shell.
- `games/pixel-quest/` – placeholder shell.

Each game page is directly addressable by URL.

## Local preview

Open `index.html` directly in a browser, or run any static server from repo root.
