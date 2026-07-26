import request from 'supertest';
import app from './app';

describe('NodeBackend API Integration Tests', () => {
  it('GET /api/health should return UP status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('UP');
    expect(res.body.configuredStoredFunction).toBeDefined();
  });

  it('GET /api/chat/sessions should return list of sessions', async () => {
    const res = await request(app).get('/api/chat/sessions?userId=user-1');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/ai/query without body should fail validation', async () => {
    const res = await request(app).post('/api/ai/query').send({});
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
  });
});
