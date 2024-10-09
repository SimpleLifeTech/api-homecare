import { Inject, Injectable } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { PrismaService } from "@prisma/prisma/prisma.service"
import { IUserRepository } from "src/modules/user/implementations/user.repository"
import { UserPrismaRepository } from "src/modules/user/infra/prisma/user.prisma.repository"
import { AuthService } from "../../auth.service"
import { PrivatePhoneAuthDto } from "../../dto/auth.dto"
import { IResponseLogin } from "../../types/response-login.type"

import { LoginRoles } from "../../business/login.roles"
import { ConfigService } from "#kernel/config/config.service"

@Injectable()
export class LoginWppService extends AuthService {
  constructor(
    @Inject(UserPrismaRepository)
    protected userRepository: IUserRepository,
    protected jwtService: JwtService,
    protected prisma: PrismaService,
    protected config: ConfigService,
  ) {
    super(jwtService, prisma, config)
  }

  async execute(auth_dto: PrivatePhoneAuthDto): Promise<IResponseLogin> {
    const errors = new LoginRoles()
    const user = await this.prisma.users.findFirst({
      where: { phone: auth_dto.phone },
      orderBy: { phoneConfirmedAt: "asc" },
    })

    await errors.userNotFind(user?.id)
    await errors.phoneNotConfirmed(user.phoneConfirmedAt)
    await errors.userDeleted(user?.deleted_at)

    const tokens = await this.getTokens({
      userId: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
    })

    await this.updateRtHash(user.id, tokens.refresh_token)

    await this.userRepository.update(user.id, { last_sign_in_at: new Date() })

    return { tokens }
  }
}
