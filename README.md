# Salon Automation Hub

AI-powered marketing automation platform for salons. Generate personalized email and SMS campaigns using Claude AI, seamlessly integrated with Gmail and Square.

![Status](https://img.shields.io/badge/status-active-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)

## Features

- 🤖 **AI-Powered Messages** - Uses Claude AI to generate personalized marketing content
- 📧 **Email Integration** - Draft campaigns directly in Gmail
- 💬 **SMS Support** - Send SMS via Square customer database
- ⚡ **Real-time Preview** - See AI-generated content before sending
- 🎯 **Smart Automation** - Three pre-built automation flows:
  - Welcome sequences for new clients
  - Win-back campaigns for inactive clients
  - Promotional offers with custom details
- 🔐 **Secure** - Backend API handles sensitive credentials

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Anthropic API key
- Square account & credentials
- Gmail account (for OAuth)

### Installation

```bash
git clone https://github.com/yourusername/salon-automation-hub.git
cd salon-automation-hub
npm install
```

### Setup Environment

```bash
cp .env.example .env
```

Edit `.env` with your credentials (see [API_KEYS.md](docs/API_KEYS.md))

### Run Locally

```bash
# Start both frontend and backend
npm run dev

# Frontend runs on http://localhost:5173
# Backend runs on http://localhost:3001
```

### Build for Production

```bash
npm run build
```

## Project Structure

```
salon-automation-hub/
├── src/                          # React frontend
│   ├── components/               # React components
│   ├── hooks/                    # Custom React hooks
│   ├── utils/                    # Utilities & constants
│   └── main.jsx                  # Entry point
├── backend/                      # Node.js/Express API
│   ├── routes/                   # API endpoints
│   ├── services/                 # Business logic
│   ├── middleware/               # Express middleware
│   └── server.js                 # Main server file
├── tests/                        # Test suites
├── docs/                         # Documentation
├── public/                       # Static assets
└── package.json                  # Dependencies
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/ai/generate` | Generate AI message |
| `POST` | `/api/automations/send` | Send automation campaign |

## Testing

```bash
# Run all tests
npm test

# Run with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

## Deployment

See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed instructions on deploying to:
- Vercel (recommended)
- Netlify
- Firebase
- AWS

## Documentation

- [Setup Guide](docs/SETUP.md) - Detailed setup instructions
- [API Keys Setup](docs/API_KEYS.md) - Configure Anthropic, Square, Gmail
- [Deployment Guide](docs/DEPLOYMENT.md) - Production deployment
- [Architecture](docs/ARCHITECTURE.md) - Technical overview

## Environment Variables

See `.env.example` for all required variables:

```bash
ANTHROPIC_API_KEY=your_key
SQUARE_ACCESS_TOKEN=your_token
GMAIL_CLIENT_ID=your_id
# ... more in .env.example
```

## Support

- 📚 [Documentation](docs/)
- 🐛 [Report Issues](https://github.com/yourusername/salon-automation-hub/issues)
- 💬 [Discussions](https://github.com/yourusername/salon-automation-hub/discussions)

## Roadmap

- [ ] Database persistence (MongoDB/PostgreSQL)
- [ ] Advanced segmentation
- [ ] A/B testing
- [ ] Analytics dashboard
- [ ] Scheduling campaigns
- [ ] Multi-salon support
- [ ] Webhooks for Square integration
- [ ] Mobile app

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT © 2024

## Author

Built with ❤️ for salon owners
