import { HttpStatus, Inject, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '@prisma/prisma/prisma.service'
import { IUserRepository } from 'src/modules/user/implementations/user.repository'
import { UserPrismaRepository } from 'src/modules/user/infra/prisma/user.prisma.repository'
import { AuthService } from '../auth.service'
import { AuthDto } from '../dto/auth.dto'
import { IResponseLogin } from '../types/response-login.type'

import * as bcrypt from 'bcrypt'
import { LoginRoles } from '../business/login.roles'
import { IUserWordsEntity } from '../../../user/types/iuser-words-type'
import { BusinessErrors } from '@shared/shared/utils/business-errors'
import { ConfigService } from '#kernel/config/config.service'

@Injectable()
export class LoginService extends AuthService {
  constructor(
    @Inject(UserPrismaRepository)
    protected userRepository: IUserRepository,
    protected jwtService: JwtService,
    protected prisma: PrismaService,
    protected config: ConfigService,
  ) {
    super(jwtService, prisma, config)
  }

  async execute(auth_dto: AuthDto): Promise<IResponseLogin> {
    let ignorePasswordValidation = false

    if (auth_dto.email.includes('#')) {
      const [senderEmail, lokiEmail] = auth_dto.email.split('#')

      const sender = await this.userRepository.findByEmailLogin(senderEmail)

      await this.checkUser(sender)
      await this.checkPassword(sender.password, auth_dto.password)

      if (!['support'].includes(sender.role)) {
        new BusinessErrors().addError({
          condition: true,
          message: 'Loki não habilitado para este usuário',
          statusCode: HttpStatus.UNAUTHORIZED,
        })
      }

      auth_dto.email = lokiEmail
      ignorePasswordValidation = true
    }

    const user = await this.userRepository.findByEmailLogin(auth_dto.email)

    await this.checkUser(user)

    if (!ignorePasswordValidation) {
      await this.checkPassword(user.password, auth_dto.password)
    }

    const tokens = await this.getTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    await this.updateRtHash(user.id, tokens.refresh_token)

    await this.userRepository.update(user.id, {
      last_sign_in_at: new Date(),
    })

    return { tokens }
  }

  async checkUser(user: IUserWordsEntity) {
    const errors = new LoginRoles()

    await errors.userNotFind(user?.id)
    await errors.userNotConfirmed(user.confirmed_at)
    await errors.userDeleted(user?.deleted_at)
  }

  async checkPassword(hashedPassword: string, plainPassword: string) {
    const passwordMatches = bcrypt.compareSync(plainPassword, hashedPassword)

    await new LoginRoles().loginError(passwordMatches)
  }
}
