import { Injectable } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { PrismaService } from "@prisma/prisma/prisma.service"
import { AuthService } from "../../auth.service"
import { ConfigService } from "#kernel/config/config.service"

@Injectable()
export class LogoutService extends AuthService {
  constructor(
    protected jwtService: JwtService,
    protected prisma: PrismaService,
    protected config: ConfigService,
  ) {
    super(jwtService, prisma, config)
  }

  async execute(user_id: string): Promise<boolean> {
    await this.prisma.users.update({
      where: {
        id: user_id,
        hashedRt: {
          not: null,
        },
      },
      data: {
        hashedRt: null,
      },
    })
    return true
  }
}
