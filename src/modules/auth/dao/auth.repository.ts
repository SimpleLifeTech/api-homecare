import { JwtService } from "@nestjs/jwt";
import { Injectable } from "@nestjs/common";
import { Tokens, GenTokenPayload, JwtPayload } from "../types/auth.type";

@Injectable()
export class AuthRepository {
  constructor(private jwtService: JwtService) {}

  async getTokens(payload: GenTokenPayload): Promise<Tokens> {
    const { userId, ...rest } = payload;

    const jwtPayload: JwtPayload = {
      sub: userId,
      ...rest,
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.AT_SECRET,
        expiresIn: process.env.AT_EXPIRES_IN ?? "24h",
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.RT_SECRET,
        expiresIn: process.env.RT_EXPIRES_IN ?? "7d",
      }),
    ]);

    return {
      accessToken: at,
      refreshToken: rt,
    };
  }
}
