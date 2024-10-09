import { Inject, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '@prisma/prisma/prisma.service'
import { IUserRepository } from 'src/modules/user/implementations/user.repository'
import { UserPrismaRepository } from 'src/modules/user/infra/prisma/user.prisma.repository'
import { AuthService } from '../../auth.service'
import { IResponseLogin } from '../../types/response-login.type'
import { OAuth2Client } from 'google-auth-library'
import { CreateStripeCustomerService } from '@modules/global/stripe/use-cases/create-stripe-customer/create-stripe-customer.service'
import { UpdateUserDto } from '@modules/user/dto/update-user.dto'
import { TokenPayload } from 'google-auth-library'
import { CreateUserDto } from '@modules/user/dto/create-user.dto'
import { ConfigService } from '#kernel/config/config.service'

@Injectable()
export class GoogleAuthService extends AuthService {
  constructor(
    @Inject(UserPrismaRepository)
    protected userRepository: IUserRepository,
    protected jwtService: JwtService,
    protected prisma: PrismaService,
    protected config: ConfigService,
    protected createStripeCustomer: CreateStripeCustomerService,
  ) {
    super(jwtService, prisma, config)
  }

  async execute(user: TokenPayload): Promise<IResponseLogin> {
    let myUser = await this.userRepository.findByEmailLogin(user.email)

    if (!myUser) {
      const userInfo: CreateUserDto = {
        email: user.email,
        password: '',
        name: user.name,
        confirmed_at: new Date(),
        image_url: user.picture,
        phone: null,
        stripeId: null,
      }

      await this.userRepository.create(userInfo)

      myUser = await this.userRepository.findByEmailLogin(user.email)
    }

    const updatePayload: UpdateUserDto = {
      last_sign_in_at: new Date(),
    }

    if (!myUser.stripeId) {
      updatePayload.stripeId = await this.createStripeCustomer.execute({
        email: myUser.email,
      })
    }

    if (myUser && !myUser.confirmed_at) {
      updatePayload.email_confirm_token = null
      updatePayload.confirmed_at = new Date()
    }

    if (myUser && !myUser.image_url) {
      updatePayload.image_url = user?.picture
    }

    await this.userRepository.update(myUser.id, updatePayload)

    const tokens = await this.getTokens({
      userId: myUser.id,
      email: myUser.email,
      role: myUser.role,
    })

    return { tokens }
  }

  async verifyCode(code: string): Promise<IResponseLogin> {
    const client = new OAuth2Client(
      this.config.get('GOOGLE_CLIENT_ID'),
      this.config.get('GOOGLE_CLIENT_SECRET'),
      this.config.get('CLIENT_URL'),
    )

    const token = await client.getToken(code)

    const response = await client.verifyIdToken({
      idToken: token.tokens.id_token,
      audience: this.config.get('GOOGLE_CLIENT_ID'),
    })

    return this.execute(response.getPayload())
  }
}
