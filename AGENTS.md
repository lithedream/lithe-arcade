# AGENTS instructions for Lithe Arcade

Scope: entire repository.

## Project intent

This repository hosts a browser-arcade hub where every game is independent and directly routable.

## Required structure for new games

- Create a dedicated folder under `games/<slug>/`.
- Add a standalone `index.html` in that folder.
- Ensure each game can be opened directly without first loading homepage.
- Keep game-specific assets local to that folder whenever possible.

## UX contract for every game shell

- Must include a **Start Game** control.
- Must include **Return Homepage** in menu state.
- Must show **Return Homepage** again in pause/game-over states.
- During active playing state, hide the return-home link/button.

## Homepage contract

- Homepage must list games with name + description.
- Homepage list must support sorting by newest/oldest.
- Homepage palette should stay in the violet/blue/magenta/yellow family.
