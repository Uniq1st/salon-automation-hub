# Setup Guide

Complete instructions for getting the Salon Automation Hub running locally.

## Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** (comes with Node.js) or **yarn**
- **Git** ([Download](https://git-scm.com/))
- A code editor (VS Code recommended)

## Installation Steps

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/salon-automation-hub.git
cd salon-automation-hub
```

### 2. Install Dependencies

```bash
npm install
```

This installs packages for both frontend and backend:
- React & Vite (frontend)
- Express (backend)
- Testing libraries
- Development tools

### 3. Environment Setup

```bash
# Copy template
cp .env.example .env

# Edit with your credentials
nano .env  # or open in your editor
```

See [API_KEYS.md](API_KEYS.md) for detailed credential setup.

### 4. Start Development Server

```bash
# Runs frontend (port 5173) + backend (port 3001)
npm run dev
```

You'll see:
```
$ npm run dev

> salon-automation-hub@1.0.0 dev
> concurrently "npm run dev:frontend" "npm run dev:backend"

[0] > salon-automation-hub@1.0.0 dev:frontend
[0] > vite
[0]
[0]   VITE v5.0.0  ready in 345 ms
[0]
[0]   ➜  Local:   http://localhost:5173/
[0]   ➜  press h to show help
[1] 🚀 Backend server running on http://localhost:3001
```

Open your browser to **http://localhost:5173**

## Troubleshooting

### Port Already in Use

If port 5173 or 3001 is already in use:

```bash
# Frontend
npm run dev:frontend -- --port 5174

# Backend (edit port in .env)
PORT=3002 npm run dev:backend
```

### Missing Dependencies

```bash
rm package-lock.json
npm cache clean --force
npm install
```

### API Key Errors

Check that your `.env` file has valid keys. See [API_KEYS.md](API_KEYS.md).

## Project Structure

```
src/                    # React components
├── components/         # UI components
├── hooks/              # Custom hooks (useAIGeneration)
├── utils/              # Constants, helpers
└── main.jsx            # Entry point

backend/                # Express API
├── routes/             # API endpoints
├── services/           # Business logic (Anthropic, Square, Gmail)
└── server.js           # Server config

tests/                  # Test files
public/                 # Static HTML
```

## Available Commands

```bash
npm run dev              # Start dev servers (frontend + backend)
npm run dev:frontend     # Start only frontend
npm run dev:backend      # Start only backend
npm run build            # Build for production
npm run preview          # Preview production build
npm test                 # Run tests
npm run test:ui          # Run tests with UI
npm run test:coverage    # Generate coverage report
npm run lint             # Lint code
npm start                # Start production server
```

## Next Steps

1. **Configure APIs** → [API_KEYS.md](API_KEYS.md)
2. **Run tests** → `npm test`
3. **Deploy** → [DEPLOYMENT.md](DEPLOYMENT.md)
4. **Learn architecture** → [ARCHITECTURE.md](ARCHITECTURE.md)

## Getting Help

- 📖 Check [README.md](../README.md)
- 🐛 [Report Issues](https://github.com/yourusername/salon-automation-hub/issues)
- 💬 [Start Discussion](https://github.com/yourusername/salon-automation-hub/discussions)
