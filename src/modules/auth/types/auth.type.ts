export interface IResponseLogin {
  tokens: Tokens;
}

export type GenTokenPayload = { userId: string; email: string };

export type Tokens = {
  access_token: string;
  refresh_token: string;
};

export type JwtPayload = {
  sub: string;
  email?: string;
};
