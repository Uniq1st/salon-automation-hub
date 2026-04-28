import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import aiRoutes from './routes/ai.js';
import automationRoutes from './routes/automations.js';
import healthRoutes from './routes/health.js';
import contentRoutes from './routes/content.js';
import squareRoutes from './routes/square.js';
import photoRoutes from './routes/photos.js';
import socialRoutes from './routes/social.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({ origin: '*', credentials: false }));

// API routes
app.use('/api/health', healthRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/automations', automationRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/square', squareRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/social', socialRoutes);

// Serve built React frontend — works in production (dist exists) and skips in dev
const distPath = path.resolve(process.cwd(), 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));
} else {
  app.get('/', (req, res) => res.json({ message: 'API running. Frontend served separately in dev mode.' }));
}

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Frontend dist: ${fs.existsSync(distPath) ? 'found ✓' : 'not found (dev mode)'}`);
});
