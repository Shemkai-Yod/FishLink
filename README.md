# FishLink

FishLink is a React + TypeScript frontend prototype for an intelligent fish-farming ecosystem.

## Requirements
- Node.js 20.19+ or 22.12+
- npm

## Run locally
```bash
npm install
npm run dev
```

## Verify before publishing
```bash
npm run typecheck
npm run build
```

## Project structure
```text
src/
  components/
    PondSimulation.tsx
  App.tsx
  App.css
  main.tsx
index.html
package.json
vite.config.ts
 tsconfig.json
```

## Languages
The interface includes English, Hausa, Yoruba, and Nigerian Pidgin. User-entered content (farm names, pond names, seller listings, and community messages) is intentionally kept as entered rather than automatically translated.

## Current integration boundaries
- Account/login behaviour is a frontend prototype and stores data in this browser; it is not secure production authentication.
- Farm, pond, feeding, water-reading, listing, and community data are currently browser-local. A Django REST API and database are not connected in this frontend package.
- The Pond Simulation page is an integration workspace. It intentionally does not invent fish-growth calculations or display a fake animation. The animation team can mount its component in `src/components/PondSimulation.tsx`.
- Marketplace listings are demonstration content; checkout and payments are not implemented.

## Environment variables
No secrets or API keys should be committed. Add future backend URLs through environment variables (for Vite, prefix client-exposed variables with `VITE_`) and keep private credentials on the server.


## Publish to GitHub
1. Create an empty GitHub repository named `FishLink` (or use the existing team repository).
2. Open a terminal in the project root.
3. Run:
   ```bash
   git init
   git add .
   git commit -m "Prepare FishLink frontend release"
   git branch -M main
   git remote add origin https://github.com/OWNER/REPOSITORY.git
   git push -u origin main
   ```
4. Replace `OWNER/REPOSITORY` with the actual repository path. If the repository already has files or commits, clone it first and copy these project files into the cloned folder instead of pushing a separate history.
