# Jai's Arcade

A collection of games built by Jai and Dad.

## Project Structure

```
jai-games/
├── index.html                  # Arcade homepage (game gallery)
├── shared/
│   └── style.css               # Shared CSS variables used by all pages
├── games/
│   ├── registry.json           # List of all games (used by homepage)
│   └── platformer/             # One folder per game
│       ├── config.json         # Game settings (speed, gravity, etc.)
│       ├── index.html          # Game page
│       ├── game.js             # Game logic
│       ├── style.css           # Game styles
│       └── assets/
│           ├── images/
│           └── sounds/
```

## How to Add a New Game

1. Create a new folder under `games/` (e.g. `games/quiz/`)
2. Add `config.json`, `index.html`, `game.js`, `style.css` inside it
3. Add an entry to `games/registry.json` — the homepage card appears automatically

## How to Play Locally

Open with a local server (required because of `fetch()` for JSON):

```bash
# Python
python3 -m http.server 8000

# Node (npx)
npx serve .
```

Then open http://localhost:8000

## Deploying to GitHub Pages

1. Push this folder to a GitHub repo
2. Go to Settings → Pages → Source: **Deploy from branch** → `main` / `(root)`
3. Your arcade will be live at `https://<username>.github.io/<repo-name>/`
