import { Inject, Injectable } from "@nestjs/common"
import { EmailService } from "@shared/shared/utils/email/send-mail"
import { generateRandomToken } from "@shared/shared/utils/token-functions"
import { ProfileEntity } from "src/modules/profile/entities/profile.entity"
import { ProfilePrismaRepository } from "src/modules/profile/infra/prisma/profile.prisma.repository"
import { UserRoles } from "../../business/user.roles"
import { ChangePasswordRequestDto } from "../../dto/change-password-request"
import { UserEntity } from "../../entities/user.entity"
import { IUserRepository } from "../../implementations/user.repository"
import { UserPrismaRepository } from "../../infra/prisma/user.prisma.repository"
import { PrismaService } from "@prisma/prisma/prisma.service"
import { RateLimitChangePasswordRequest } from "@modules/user/exceptions/RateLimitChangePasswordRequest"

const CONFIRMATION_TYPE = "change-password"
const EXPIRATION_SECONDS = 5 * 60
const RATE_LIMIT_REQUEST_SECONDS = 60

@Injectable()
export class ChangePasswordRequestService extends UserRoles {
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

  async execute(change_password_request_dto: ChangePasswordRequestDto): Promise<void> {
    // clean the business roles cache
    this.clearErrors()

    const user: UserEntity = await this.userRepository.findByEmail(
      change_password_request_dto?.email,
    )

    await this.userNotFound(user)
    await this.userHasBeenDeleted(user?.deleted_at)
    await this.userNotFound(user)

    const { id: userId, email: userEmail } = user

    const previousRequestsCount = await this.prisma.transactionRequest.findFirst({
      where: {
        userId,
        createdAt: { gte: new Date(Date.now() - RATE_LIMIT_REQUEST_SECONDS * 1000) },
      },
      orderBy: { createdAt: "desc" },
    })

    if (!!previousRequestsCount) {
      throw new RateLimitChangePasswordRequest()
    }

    const code = generateRandomToken(4)

    await this.prisma.$transaction(async (tx) => {
      await tx.transactionRequest.create({
        data: {
          type: CONFIRMATION_TYPE,
          code,
          expiresAt: new Date(Date.now() + EXPIRATION_SECONDS * 1000),
          userId,
          payload: {
            userEmail,
          },
        },
      })
    })

    await this.userRepository.update(user.id, {
      password_change_sent_at: new Date(),
    })

    const link = `${process.env.CLIENT_URL}/auth/reset-password/?token=${code}`
    const profile: ProfileEntity = await this.profileRepository.findByUserId(user?.id)

    await this.emailService.sendEmail(
      user?.email,
      "Solicitação de redefinição de senha",
      { name: profile?.name, link: link },
      "requestResetPassword",
    )
  }
}
