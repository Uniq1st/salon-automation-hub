# Architecture & Technical Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT BROWSER                            │
│  React App (Vite) @ http://localhost:5173                   │
│  ├── SalonAutomationHub.jsx (Main component)                │
│  ├── PreviewModal.jsx (Preview & send UI)                   │
│  └── useAIGeneration (Custom hook)                          │
└─────────────────────┬───────────────────────────────────────┘
                      │ HTTP/HTTPS
                      │ (Fetch API)
┌─────────────────────▼───────────────────────────────────────┐
│                   BACKEND API                                │
│  Express @ http://localhost:3001                            │
│  ├── /api/health (Health check)                             │
│  ├── /api/ai/generate (Claude AI integration)               │
│  └── /api/automations/send (Gmail + Square)                 │
└─────────────────────┬───────────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
        ▼             ▼             ▼
    ┌───────┐   ┌───────┐   ┌──────────┐
    │Claude │   │Square │   │ Gmail    │
    │ API   │   │ API   │   │ API      │
    │(AI)   │   │(SMS)  │   │(Email)   │
    └───────┘   └───────┘   └──────────┘
```

## Technology Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool & dev server
- **Vitest** - Unit testing
- **React Testing Library** - Component testing

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **Anthropic SDK** - Claude AI API
- **CORS** - Cross-origin requests

### External APIs
- **Claude Sonnet 4** - AI message generation
- **Square API** - Customer data & SMS
- **Gmail API** - Email drafting

### DevOps
- **Git** - Version control
- **GitHub** - Repository & CI/CD
- **Vercel** - Production hosting (recommended)
- **dotenv** - Environment management

## Component Architecture

### Frontend Components

```
SalonAutomationHub (Main)
├── Header Section
│   ├── Title & Status Tags
│   └── Stats Display
├── Automation Cards (3 types)
│   ├── Welcome automation
│   ├── Win-back automation
│   └── Promotional automation
├── Promo Settings Panel
└── PreviewModal (When active)
    ├── Tab switcher (Email/SMS)
    ├── Preview area
    ├── Send button
    └── Result message
```

### State Management

```javascript
// Main component state
const [activeModal, setActiveModal] = useState(null);
const [templates, setTemplates] = useState(defaultTemplates);
const [sending, setSending] = useState(false);
const [results, setResults] = useState({});
const [aiLoading, setAiLoading] = useState({});
```

## Backend Routes

### 1. Health Check
```
GET /api/health
Response: { success: true, status: "healthy", ... }
```

### 2. AI Message Generation
```
POST /api/ai/generate
Body: { automationId: "welcome", prompt: "..." }
Response: { success: true, template: { subject, email, sms } }
```

### 3. Send Automation
```
POST /api/automations/send
Body: { automationId, template, clientCount }
Response: { success: true, results: { email, sms }, message: "..." }
```

## Data Flow

### 1. User Clicks "Preview & Send"

```
1. Frontend: handleOpenModal(automationId)
   ↓
2. Frontend: Call useAIGeneration hook
   ↓
3. Backend: POST /api/ai/generate
   ↓
4. Backend: Call Anthropic API with salon context
   ↓
5. Claude: Generate personalized message
   ↓
6. Frontend: Display in PreviewModal
```

### 2. User Clicks "Generate & Queue"

```
1. Frontend: handleSend(automationId)
   ↓
2. Backend: POST /api/automations/send
   ↓
3. Backend: Call Gmail API (draft email)
   ↓
4. Backend: Call Square API (queue SMS)
   ↓
5. Response: Success message to frontend
   ↓
6. Frontend: Show "✓ Queued" indicator
```

## Security Considerations

### API Key Management
- All API keys stored in `.env` (never in code)
- Backend validates all requests
- Frontend doesn't have direct API access

### CORS Configuration
```javascript
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));
```

### Input Validation
- Backend validates all incoming data
- AI prompts sanitized to prevent injection
- Error messages don't expose sensitive info

## Performance Optimizations

### Frontend
- **Code splitting** - Lazy load components
- **Asset optimization** - Minified CSS/JS
- **Caching** - Browser cache for static assets
- **Debouncing** - Prevent excessive API calls

### Backend
- **Connection pooling** - Reuse API connections
- **Request caching** - Cache frequently used data
- **Rate limiting** - Prevent abuse
- **Error handling** - Graceful failures

## Database Schema (Future)

When adding persistence:

```sql
-- Automations table
CREATE TABLE automations (
  id UUID PRIMARY KEY,
  salonId UUID NOT NULL,
  type ENUM('welcome', 'winback', 'promo'),
  template JSONB,
  createdAt TIMESTAMP,
  sentAt TIMESTAMP
);

-- Clients table
CREATE TABLE clients (
  id UUID PRIMARY KEY,
  squareId VARCHAR,
  email VARCHAR,
  phone VARCHAR,
  firstName VARCHAR,
  lastVisit TIMESTAMP
);

-- Campaign logs table
CREATE TABLE campaign_logs (
  id UUID PRIMARY KEY,
  automationId UUID,
  clientCount INT,
  successCount INT,
  failureCount INT,
  sentAt TIMESTAMP
);
```

## Error Handling

### Frontend
```javascript
try {
  const result = await generateWithAI(automationId);
} catch (error) {
  console.error("AI generation error:", error);
  // Fallback to default template
}
```

### Backend
```javascript
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message,
  });
});
```

## Testing Strategy

### Unit Tests
- Component rendering
- Hook logic
- Service functions
- Utility functions

### Integration Tests
- API endpoints
- Frontend + Backend interaction
- External API mocks

### E2E Tests (Future)
- Full user workflows
- Campaign creation & sending
- Error scenarios

## Scaling Considerations

### Current Limitations
- Single-instance deployment
- No persistent database
- Memory-based state (resets on restart)

### For Production Scale
1. **Database** - Store campaigns, logs, settings
2. **Queue System** - Queue long-running tasks
3. **Caching** - Redis for frequently accessed data
4. **Load Balancing** - Multiple API instances
5. **Monitoring** - Track errors, performance
6. **Logging** - Centralized log aggregation

## Deployment Architecture

### Development
```
Local Machine
├── Frontend: http://localhost:5173
└── Backend: http://localhost:3001
```

### Production (Vercel)
```
Vercel
├── Frontend: salon-automation-hub.vercel.app
├── Serverless Functions: api/*
└── Environment Variables: .env.production
```

## CI/CD Pipeline

Automatic deployment on push to main:

```
1. Code pushed to GitHub
   ↓
2. GitHub Actions runs tests
   ↓
3. If tests pass → Build
   ↓
4. If build succeeds → Deploy to Vercel
   ↓
5. Production live!
```

## Monitoring & Observability

### Health Checks
- `/api/health` endpoint
- Database connection status
- External API availability

### Metrics to Track
- Request latency
- Error rate
- API quota usage
- User session count

### Logging
- Request/response logs
- Error stack traces
- Performance metrics
- Business events (campaigns sent, etc.)

## Dependencies Overview

| Package | Purpose | Size |
|---------|---------|------|
| `react` | UI framework | 42 KB |
| `express` | Backend server | 52 KB |
| `@anthropic-ai/sdk` | Claude API client | 28 KB |
| `axios` | HTTP client | 14 KB |
| `dotenv` | Environment variables | 3 KB |

## Future Enhancements

### Phase 1 (Current)
- ✅ AI message generation
- ✅ Email & SMS sending
- ✅ Preview UI

### Phase 2 (Q2 2024)
- 📅 Database persistence
- 📈 Analytics & reporting
- 🎯 Advanced segmentation
- ⏰ Campaign scheduling

### Phase 3 (Q3 2024)
- 🔄 A/B testing
- 👥 Multi-salon support
- 📱 Mobile app
- 🎨 Custom branding

### Phase 4 (Q4 2024)
- 🤖 ML-based optimization
- 💬 Live chat support
- 🔌 Zapier integration
- 📊 Advanced dashboard

---

## Document Version

- **Version**: 1.0.0
- **Last Updated**: April 2024
- **Author**: Development Team

See [SETUP.md](SETUP.md) and [API_KEYS.md](API_KEYS.md) for more details.
