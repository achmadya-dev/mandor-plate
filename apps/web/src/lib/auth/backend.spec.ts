import { ApiProxyError, parseApiErrorBody } from './backend';

describe('ApiProxyError', () => {
  it('carries status and body for BFF forwarding', () => {
    const error = new ApiProxyError(422, { errors: { email: ['invalid'] } });
    expect(error.status).toBe(422);
    expect(error.body).toEqual({ errors: { email: ['invalid'] } });
  });
});

describe('parseApiErrorBody', () => {
  it('returns json body when present', async () => {
    const response = new Response(JSON.stringify({ message: 'bad' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });

    await expect(parseApiErrorBody(response)).resolves.toEqual({ message: 'bad' });
  });

  it('falls back when body is not json', async () => {
    const response = new Response('nope', { status: 500, statusText: 'Server Error' });
    await expect(parseApiErrorBody(response)).resolves.toEqual({ message: 'Server Error' });
  });
});
