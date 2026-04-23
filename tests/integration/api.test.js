import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import app from '../../backend/server.js';

describe('API Integration Tests', () => {
  it('should return health status', async () => {
    const response = await request(app).get('/api/health');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('status', 'healthy');
  });

  it('should handle AI generation request', async () => {
    const response = await request(app)
      .post('/api/ai/generate')
      .send({
        automationId: 'welcome',
        prompt: 'Generate a welcome message'
      });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success');
  });
});
