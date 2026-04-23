import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateAIMessage } from '../../backend/services/anthropic.js';

// Mock the Anthropic client
vi.mock('@anthropic-ai/sdk', () => {
  return {
    default: vi.fn(() => ({
      messages: {
        create: vi.fn(async () => ({
          content: [
            {
              text: JSON.stringify({
                subject: 'Test Subject',
                email: 'Test Email',
                sms: 'Test SMS'
              })
            }
          ]
        }))
      }
    }))
  };
});

describe('Anthropic AI Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should generate AI message', async () => {
    const prompt = 'Generate a salon welcome message';
    const result = await generateAIMessage(prompt);
    
    expect(result).toHaveProperty('subject');
    expect(result).toHaveProperty('email');
    expect(result).toHaveProperty('sms');
  });

  it('should handle JSON parsing errors', async () => {
    // This test would catch formatting issues
    expect(async () => {
      await generateAIMessage('invalid prompt');
    }).rejects.toThrow();
  });
});
