import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

describe('API_URL', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('開発モードでは window.location ベースの /api URL を返す', async () => {
    vi.stubEnv('DEV', true);

    const { API_URL } = await import('@/config/api');
    expect(API_URL).toBe(
      `${window.location.protocol}//${window.location.host}/api`,
    );
  });

  it('本番モードでは VITE_API_URL を返す', async () => {
    vi.stubEnv('DEV', false);
    vi.stubEnv('VITE_API_URL', 'https://api.example.com');

    const { API_URL } = await import('@/config/api');
    expect(API_URL).toBe('https://api.example.com');
  });
});
