import { describe, it, expect, beforeAll } from 'vitest';
import axios from 'axios';

const BASE_URL = 'http://localhost:5000';
let axiosInstance;

beforeAll(() => {
  axiosInstance = axios.create({
    baseURL: BASE_URL,
    validateStatus: () => true,
  });
});

describe('Signup Flow', () => {
  it('POST /api/signup with valid data returns apiKey', async () => {
    const signupData = {
      name: 'Test User',
      email: `test-${Date.now()}@example.com`,
      company: 'Test Company Inc',
    };

    const res = await axiosInstance.post('/api/signup', signupData);
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    expect(res.data.apiKey).toBeDefined();
    expect(res.data.apiKey).toMatch(/^sk-/);
  });

  it('POST /api/signup without name returns 400', async () => {
    const res = await axiosInstance.post('/api/signup', {
      email: 'test@example.com',
      company: 'Test Company',
    });
    expect(res.status).toBe(400);
    expect(res.data.error).toBeDefined();
  });

  it('POST /api/signup without email returns 400', async () => {
    const res = await axiosInstance.post('/api/signup', {
      name: 'Test User',
      company: 'Test Company',
    });
    expect(res.status).toBe(400);
    expect(res.data.error).toBeDefined();
  });

  it('POST /api/signup without company returns 400', async () => {
    const res = await axiosInstance.post('/api/signup', {
      name: 'Test User',
      email: 'test@example.com',
    });
    expect(res.status).toBe(400);
    expect(res.data.error).toBeDefined();
  });

  it('Generated API key has correct format', async () => {
    const signupData = {
      name: 'Test User',
      email: `test-${Date.now()}@example.com`,
      company: 'Test Company',
    };

    const res = await axiosInstance.post('/api/signup', signupData);
    expect(res.status).toBe(200);
    const apiKey = res.data.apiKey;
    expect(apiKey).toMatch(/^sk-[a-z0-9]{32}$/);
  });
});
