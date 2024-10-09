import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '@prisma/prisma/prisma.service'
import { JwtPayload, Tokens } from './types'

import * as argon from 'argon2'
import { ConfigService } from '#kernel/config/config.service'

type GenTokenPayload = { userId: string; role: string; email: string; phone?: string }

@Injectable()
export class AuthService {
  constructor(
    protected jwtService: JwtService,
    protected prisma: PrismaService,
    protected config: ConfigService,
  ) {}

  async updateRtHash(userId: string, rt: string): Promise<void> {
    const hash = await argon.hash(rt)
    await this.prisma.users.update({
      where: {
        id: userId,
      },
      data: {
        hashedRt: hash,
      },
    })
  }

  async getTokens(payload: GenTokenPayload): Promise<Tokens> {
    const { userId, ...rest } = payload

    const jwtPayload: JwtPayload = {
      sub: userId,
      ...rest,
    }

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get('AT_SECRET'),
        expiresIn: '24h',
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get('RT_SECRET'),
        expiresIn: '7d',
      }),
    ])

    return {
      access_token: at,
      refresh_token: rt,
    }
  }
}
