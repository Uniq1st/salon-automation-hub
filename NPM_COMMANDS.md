# Quick Reference - NPM Commands

## Development

```bash
npm run dev              # Start BOTH frontend (5173) + backend (3001)
npm run dev:frontend    # Frontend only (Vite dev server)
npm run dev:backend     # Backend only (Node with auto-reload)
```

## Building

```bash
npm run build           # Build for production
npm run preview         # Preview production build locally
npm start              # Start production server
```

## Testing

```bash
npm test               # Run tests (watch mode)
npm run test:ui        # Run tests with visual UI
npm run test:coverage  # Generate coverage report
```

## Code Quality

```bash
npm run lint           # Check code style (ESLint)
```

## Useful Task Sequences

### First Time Setup
```bash
npm install            # Install dependencies
cp .env.example .env   # Create .env template
# Edit .env with your API keys
npm run dev            # Start development
```

### Before Committing
```bash
npm run lint           # Check code
npm test               # Run tests
npm run build          # Test production build
```

### Deploy to Production
```bash
npm run build          # Build
git add .
git commit -m "feat: your changes"
git push origin main   # Auto-deploys to Vercel
```

## Environment Variables

```bash
# Copy template
cp .env.example .env

# View template
cat .env.example

# Edit (macOS/Linux)
nano .env

# Edit (Windows)
notepad .env
```

## Port Issues

If ports 5173 or 3001 are in use:

```bash
# Change frontend port
npm run dev:frontend -- --port 5174

# Change backend port (edit .env)
PORT=3002 npm run dev:backend
```

## Installing Packages

```bash
npm install package-name          # Install + save
npm install --save-dev package    # Dev dependency
npm uninstall package-name        # Remove
npm update                         # Update all packages
```

## Troubleshooting

```bash
npm cache clean --force   # Clear cache
rm -rf node_modules       # Remove modules
npm install               # Reinstall everything

npm audit                 # Check security issues
npm audit fix             # Fix vulnerabilities

npm outdated              # Check for updates
```

## Useful Aliases (Add to ~/.bashrc or ~/.zshrc)

```bash
alias npm-dev="npm run dev"
alias npm-test="npm test"
alias npm-build="npm run build"
alias npm-lint="npm run lint"
```

## File Locations

| Item | Location |
|------|----------|
| Frontend | `src/` |
| Backend | `backend/` |
| Tests | `tests/` |
| Docs | `docs/` |
| Config | Root directory |
| Env vars | `.env` (create from `.env.example`) |

## Common Errors

| Error | Solution |
|-------|----------|
| Port already in use | See "Port Issues" above |
| Missing dependencies | `npm install` |
| API key errors | Check `.env` file |
| Build fails | `npm run lint && npm test` |

---

For more info, see:
- `README.md` - Overview
- `docs/SETUP.md` - Detailed setup
- `docs/DEPLOYMENT.md` - Production
