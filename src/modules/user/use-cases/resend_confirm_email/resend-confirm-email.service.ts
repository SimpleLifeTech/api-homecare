import { Inject, Injectable } from "@nestjs/common"
import { EmailService } from "@shared/shared/utils/email/send-mail"
import { generateRandomToken } from "@shared/shared/utils/token-functions"
import { profile } from "console"
import { ProfilePrismaRepository } from "src/modules/profile/infra/prisma/profile.prisma.repository"
import { UserRoles } from "../../business/user.roles"
import { ResendConfirmEmailDto } from "../../dto/resend-confirm-email.dto"
import { UserEntity } from "../../entities/user.entity"
import { IUserRepository } from "../../implementations/user.repository"
import { UserPrismaRepository } from "../../infra/prisma/user.prisma.repository"
import { PrismaService } from "@prisma/prisma/prisma.service"
import { RateLimitEmailConfirmationRequest } from "@modules/user/exceptions/RateLimitEmailConfirmationRequest"
import { period } from "@libs/helpers"

const CONFIRMATION_TYPE = "email-confirmation"

const RATE_LIMIT_REQUEST_SECONDS = 60

@Injectable()
export class ResendConfirmEmailService extends UserRoles {
  constructor(
    @Inject(UserPrismaRepository)
    protected userRepository: IUserRepository,
    @Inject(ProfilePrismaRepository)
    protected profileRepository: ProfilePrismaRepository,
    @Inject(EmailService)
    private emailService: EmailService,
    private prisma: PrismaService,
  ) {
    super()
  }

  async execute(resend_confirm_email_dto: ResendConfirmEmailDto): Promise<void> {
    // clean the business roles cache
    this.clearErrors()

    const user: UserEntity = await this.userRepository.findByEmail(resend_confirm_email_dto.email)

    await this.userNotFound(user)

    await this.userAreadyConfirmed(user?.confirmed_at)

    await this.userHasBeenDeleted(user?.deleted_at)
    const { id: userId, email: userEmail } = user
    const previousRequestsCount = await this.prisma.transactionRequest.findFirst({
      where: {
        userId,
        createdAt: { gte: new Date(Date.now() - RATE_LIMIT_REQUEST_SECONDS * 1000) },
      },
      orderBy: { createdAt: "desc" },
    })

    if (!!previousRequestsCount) {
      throw new RateLimitEmailConfirmationRequest()
    }
    const code: string = generateRandomToken(3)

    await this.prisma.$transaction(async (tx) => {
      await tx.transactionRequest.create({
        data: {
          type: CONFIRMATION_TYPE,
          code,
          expiresAt: new Date(Date.now() + period.H_3),
          userId,
          payload: {
            email: userEmail,
          },
        },
      })
    })

    const link = `${process.env.CLIENT_URL}/auth/confirm-email/?token=${code}`

    await this.emailService.sendEmail(
      user?.email,
      "Confirme seu e-mail para utilizar sua conta",
      { name: profile?.name, link: link, code },
      "confirmEmail",
    )

    await this.userRepository.update(user?.id, {
      email_confirm_sent_at: new Date(),
    })
  }
}
