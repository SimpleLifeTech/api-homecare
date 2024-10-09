import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '@prisma/prisma/prisma.service'
import * as argon from 'argon2'
import { AuthService } from '../../auth.service'
import { Tokens } from '../../types'
import { LoginRoles } from '../../business/login.roles'
import { ConfigService } from '#kernel/config/config.service'

@Injectable()
export class RefreshTokenService extends AuthService {
  constructor(
    protected jwtService: JwtService,
    protected prisma: PrismaService,
    protected config: ConfigService,
  ) {
    super(jwtService, prisma, config)
  }

  async execute(userId: string, rt: string): Promise<Tokens> {
    const errors = new LoginRoles()
    const user = await this.prisma.users.findUnique({
      where: {
        id: userId,
      },
    })

    await errors.userNotFind(user?.id)
    await errors.userDeleted(user?.deleted_at)

    await errors.acessDenied(user.hashedRt)

    const rtMatches = await argon.verify(user.hashedRt, rt)
    await errors.acessDeniedTwo(rtMatches)

    const tokens = await this.getTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    await this.updateRtHash(user.id, tokens.refresh_token)

    return tokens
  }
}
