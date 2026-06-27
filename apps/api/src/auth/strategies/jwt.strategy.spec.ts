import { UnauthorizedException } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';
import type { JwtPayloadType } from './types/jwt-payload.type';

describe('JwtStrategy', () => {
  const sessionService = {
    findById: jest.fn(),
  };
  const usersService = {
    findById: jest.fn(),
  };

  const strategy = new JwtStrategy(
    {
      getOrThrow: () => 'test-secret',
    } as never,
    sessionService as never,
    usersService as never,
  );

  const payload: JwtPayloadType = {
    id: 1,
    sessionId: 10,
    role: { id: 1, name: 'admin' },
    iat: 0,
    exp: 0,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should reject payloads without a user id', async () => {
    await expect(
      strategy.validate({ ...payload, id: undefined as never }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('should reject payloads when the session no longer exists', async () => {
    sessionService.findById.mockResolvedValue(null);

    await expect(strategy.validate(payload)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
    expect(sessionService.findById).toHaveBeenCalledWith(payload.sessionId);
  });

  it('should reject payloads when the user no longer exists', async () => {
    sessionService.findById.mockResolvedValue({ id: payload.sessionId });
    usersService.findById.mockResolvedValue(null);

    await expect(strategy.validate(payload)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('should return the payload with the current role from the database', async () => {
    sessionService.findById.mockResolvedValue({ id: payload.sessionId });
    usersService.findById.mockResolvedValue({
      id: payload.id,
      role: { id: 2, name: 'user' },
    });

    await expect(strategy.validate(payload)).resolves.toEqual({
      ...payload,
      role: { id: 2, name: 'user' },
    });
  });
});
