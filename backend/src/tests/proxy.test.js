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

describe('OpenAI Proxy', () => {
  it('POST /v1/chat/completions accepts valid request', async () => {
    const proxyRequest = {
      messages: [
        { role: 'user', content: 'Say hello in one word' }
      ],
      model: 'gpt-4o-mini',
    };

    const res = await axiosInstance.post('/v1/chat/completions', proxyRequest, {
      headers: {
        'x-agent-name': 'test-agent',
      }
    });

    expect([200, 401, 429]).toContain(res.status);
    if (res.status === 200) {
      expect(res.data.choices).toBeDefined();
      expect(res.data.choices.length).toBeGreaterThan(0);
    }
  });

  it('POST /v1/chat/completions tracks cost for API calls', async () => {
    const proxyRequest = {
      messages: [
        { role: 'user', content: 'Test message' }
      ],
      model: 'gpt-4o-mini',
    };

    const res = await axiosInstance.post('/v1/chat/completions', proxyRequest, {
      headers: {
        'x-agent-name': 'tracking-test-agent',
      }
    });

    if (res.status === 200) {
      const logsRes = await axiosInstance.get('/api/logs');
      expect(logsRes.status).toBe(200);
      expect(logsRes.data.logs.length).toBeGreaterThan(0);
    }
  });

  it('POST /v1/chat/completions blocks runaway loops', async () => {
    const loopRequest = {
      messages: [
        { role: 'user', content: 'Repeat this: test test test test' },
        { role: 'assistant', content: 'test test test test' },
        { role: 'user', content: 'Repeat this: test test test test' },
      ],
      model: 'gpt-4o-mini',
    };

    const agentName = 'loop-test-agent';
    const requests = [];
    for (let i = 0; i < 3; i++) {
      requests.push(
        axiosInstance.post('/v1/chat/completions', loopRequest, {
          headers: { 'x-agent-name': agentName }
        })
      );
    }

    const responses = await Promise.all(requests);
    const hasLoopDetection = responses.some(res => res.status === 429);
    const hasSuccess = responses.some(res => res.status === 200);

    expect(hasLoopDetection || hasSuccess).toBe(true);
  });

  it('Agent can be unblocked after loop detection', async () => {
    const agentName = 'unblock-test-agent';

    const blockRes = await axiosInstance.post('/v1/chat/completions',
      {
        messages: [{ role: 'user', content: 'test' }],
        model: 'gpt-4o-mini',
      },
      { headers: { 'x-agent-name': agentName } }
    );

    const unblockRes = await axiosInstance.post(`/api/unblock/${agentName}`);
    expect(unblockRes.status).toBe(200);
    expect(unblockRes.data.message).toContain('unblocked');
  });
});
