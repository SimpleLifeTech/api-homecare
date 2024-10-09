import { Inject, Injectable } from "@nestjs/common"
import axios from "axios"
import { UserRoles } from "../../business/user.roles"
import { CreateUserDto } from "../../dto/create-user.dto"
import { UserEntity } from "../../entities/user.entity"
import { IUserRepository } from "../../implementations/user.repository"
import { UserPrismaRepository } from "../../infra/prisma/user.prisma.repository"
import { IProfileRepository } from "src/modules/profile/implementations/profile.repository"
import { ProfilePrismaRepository } from "src/modules/profile/infra/prisma/profile.prisma.repository"
import { ISubscriptionRepository } from "src/modules/subscription/implementations/subscription.repository"
import { SubscriptionPrismaRepository } from "src/modules/subscription/infra/prisma/subscription.prisma.repository"
import { JwtService } from "@nestjs/jwt"
import { EmailService } from "@shared/shared/utils/email/send-mail"
import { IWordUsageRepository } from "src/modules/word-usage/implementations/word-usage.repository"
import { WordUsagePrismaRepository } from "src/modules/word-usage/infra/prisma/word-usage.prisma.repository"
import { PrismaService } from "@prisma/prisma/prisma.service"
import { AuthService } from "../../../auth/auth.service"
import { Tokens } from "../../../auth/types"
import { CreateStripeCustomerService } from "@modules/global/stripe/use-cases/create-stripe-customer/create-stripe-customer.service"
import { AppHttpException } from "@shared/shared/exceptions/AppHttpException"
import { CreateTransactionRequestService } from "@modules/transaction-requests/services/create-transaction-request/create-transaction-request.service"
import { period } from "@libs/helpers"

@Injectable()
export class CreateUserService extends UserRoles {
  constructor(
    @Inject(UserPrismaRepository)
    protected userRepository: IUserRepository,
    @Inject(ProfilePrismaRepository)
    protected profileRepository: IProfileRepository,
    @Inject(SubscriptionPrismaRepository)
    protected subscriptionRepository: ISubscriptionRepository,
    @Inject(WordUsagePrismaRepository)
    protected wordUsageRepository: IWordUsageRepository,
    @Inject(EmailService)
    private emailService: EmailService,
    @Inject(JwtService)
    protected jwtService: JwtService,
    @Inject(PrismaService)
    protected prisma: PrismaService,
    protected authService: AuthService,
    protected createStripeCustomer: CreateStripeCustomerService,
    private createTransactionRequest: CreateTransactionRequestService,
  ) {
    super()
  }

  async execute(create_user_dto: CreateUserDto): Promise<UserEntity> {
    const { referredCode } = create_user_dto

    // clean the business roles cache
    this.clearErrors()

    const user = await this.userRepository.findByEmail(create_user_dto.email)

    await this.emailAlreadyExists(user)

    create_user_dto.stripeId = await this.createStripeCustomer.execute({
      email: create_user_dto.email,
      name: create_user_dto.name,
      phone: create_user_dto.phone,
    })

    if (referredCode) {
      create_user_dto.referredById = await this.prisma.users
        .findUnique({ where: { referralCode: referredCode } })
        .then((user) => user && user.id)

      if (!create_user_dto.referredById) {
        throw new AppHttpException({
          message: "Código de indicação inválido",
        })
      }
    }

    const createdUser: UserEntity = await this.prisma.$transaction(async (tx) => {
      const created = await this.userRepository.withTransaction(tx).create(create_user_dto)

      if (created.referredById) {
        const referAdditionalCredits = 2000

        await Promise.all([
          this.userRepository
            .withTransaction(tx)
            .incrementAdditionalCredits(created.referredById, referAdditionalCredits),
          tx.userCreditLog.create({
            data: {
              metadata: {
                referredUserId: created.id,
              },
              referencePlatform: "web",
              reference: "referral",
              userId: created.referredById,
              amount: referAdditionalCredits,
              type: "credit",
            },
          }),
        ])
      }

      return created
    })

    const tr = await this.createTransactionRequest.execute({
      expiration: period.H_3,
      type: "email-confirmation",
      userId: createdUser.id,
      payload: {
        email: create_user_dto.email,
      },
    })

    const link = `${process.env.CLIENT_URL}/auth/confirm-email/?token=${tr.code}`

    await this.emailService.sendEmail(
      createdUser?.email,
      "Confirme seu e-mail para ativar sua conta",
      { name: create_user_dto?.name, link: link },
      "confirmEmail",
    )

    return new UserEntity(createdUser)
  }

  async create(create_user_rd_dto: any): Promise<{ user: UserEntity } & Tokens> {
    const { referral } = create_user_rd_dto

    // clean the business roles cache
    this.clearErrors()

    await axios
      .post(
        `https://api.rd.services/platform/conversions?api_key=67c8119ce674c23c7a6e3ded796ab31a`,
        {
          event_type: "CONVERSION",
          event_family: "CDP",
          payload: {
            conversion_identifier: create_user_rd_dto.fluxo,
            email: create_user_rd_dto.email,
            name: create_user_rd_dto.name,
            phone: create_user_rd_dto.phone,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
      .then((response) => response)
      .catch((error) => error)

    const user = await this.userRepository.findByEmail(create_user_rd_dto.email)

    if (user) {
      const subscription = await this.prisma.subscriptions.findFirst({
        where: { user_id: user.id },
        orderBy: { created_at: "desc" },
      })

      if (subscription && (subscription.plan_id == 1 || subscription.plan_id == 10)) {
        await this.prisma.word_usage.update({
          where: {
            user_id: user.id,
          },
          data: {
            word_quantity: 0,
          },
        })
      }

      const tokens = await this.authService.getTokens({
        userId: user.id,
        email: user.email,
        phone: user.phone,
        role: user.role,
      })

      return {
        user,
        ...tokens,
      }
    }

    create_user_rd_dto.password = btoa(String(new Date().getTime())).match(/.{1,8}/g)[0]

    create_user_rd_dto.phone = create_user_rd_dto.phone.replace(/\D/g, "")

    create_user_rd_dto.stripeId = await this.createStripeCustomer.execute({
      email: create_user_rd_dto.email,
      name: create_user_rd_dto.name,
      phone: create_user_rd_dto.phone,
    })

    if (referral) {
      create_user_rd_dto.referredById = await this.prisma.users
        .findUnique({ where: { referralCode: referral } })
        .then((user) => (user ? user.id : undefined))
    }

    const createdUser: UserEntity = await this.userRepository.create(create_user_rd_dto)

    const tr = await this.createTransactionRequest.execute({
      expiration: period.MIN_10,
      type: "email-confirmation",
      payload: {
        email: create_user_rd_dto.email,
      },
    })

    const link = `${process.env.CLIENT_URL}/auth/confirm-email/?token=${tr.code}`

    await this.emailService.sendEmail(
      createdUser?.email,
      "Confirme seu e-mail para ativar sua conta",
      { name: create_user_rd_dto?.name, link: link, password: create_user_rd_dto.password },
      "confirmEmailRD",
    )

    const tokens = await this.authService.getTokens({
      userId: createdUser.id,
      email: createdUser.email,
      phone: createdUser.phone,
      role: createdUser.role,
    })

    return {
      user: new UserEntity(createdUser),
      ...tokens,
    }
  }
}
