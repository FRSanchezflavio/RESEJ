const request = require('supertest');
const app = require('../src/app');

describe('Smoke tests de la API RE.SE.J', () => {
  test('GET /health responde 200 y estructura esperada', async () => {
    const res = await request(app).get('/health').send();
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'OK');
    expect(res.body).toHaveProperty('timestamp');
    expect(res.body).toHaveProperty('environment');
  });

  test('GET / responde 200 y contiene message', async () => {
    const res = await request(app).get('/').send();
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('version');
    expect(res.body).toHaveProperty('docs');
  });
});
