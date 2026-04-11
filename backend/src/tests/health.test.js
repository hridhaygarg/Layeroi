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

describe('Health Checks', () => {
  it('Basic health check returns 200 with ok status', async () => {
    const res = await axiosInstance.get('/health');
    expect(res.status).toBe(200);
    expect(res.data.status).toBe('ok');
  });

  it('Health check includes timestamp', async () => {
    const res = await axiosInstance.get('/health');
    expect(res.data.timestamp).toBeDefined();
    expect(new Date(res.data.timestamp).getTime()).toBeGreaterThan(0);
  });

  it('Detailed health check verifies database connectivity', async () => {
    const res = await axiosInstance.get('/health/detailed');
    expect(res.status).toMatch(/^[25]\d{2}$/);
    expect(res.data.checks).toBeDefined();
    expect(res.data.checks.database).toMatch(/healthy|unhealthy/);
  });

  it('Detailed health check verifies OpenAI proxy connectivity', async () => {
    const res = await axiosInstance.get('/health/detailed');
    expect(res.data.checks.openaiProxy).toMatch(/healthy|unhealthy/);
  });

  it('Detailed health check indicates automation status', async () => {
    const res = await axiosInstance.get('/health/detailed');
    expect(res.data.checks.automation).toBe('scheduled');
  });

  it('System status endpoint returns uptime', async () => {
    const res = await axiosInstance.get('/api/system-status');
    expect(res.status).toBe(200);
    expect(res.data.uptime).toBeGreaterThan(0);
  });

  it('System status shows memory usage', async () => {
    const res = await axiosInstance.get('/api/system-status');
    expect(res.data.memoryUsage).toBeDefined();
    expect(res.data.memoryUsage.heapUsed).toBeGreaterThan(0);
  });

  it('System status lists all automation schedules', async () => {
    const res = await axiosInstance.get('/api/system-status');
    expect(res.data.automations.seo).toBeDefined();
    expect(res.data.automations.coldEmails).toBeDefined();
    expect(res.data.automations.clickDetection).toBeDefined();
    expect(res.data.automations.freeTierChecks).toBeDefined();
    expect(res.data.automations.weeklyReports).toBeDefined();
  });
});
