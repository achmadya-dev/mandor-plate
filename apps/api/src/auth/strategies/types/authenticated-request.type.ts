import { JwtPayloadType } from './jwt-payload.type';
import { JwtRefreshPayloadType } from './jwt-refresh-payload.type';

export type RequestWithJwtPayload = {
  user: JwtPayloadType;
};

export type RequestWithJwtRefreshPayload = {
  user: JwtRefreshPayloadType;
};
