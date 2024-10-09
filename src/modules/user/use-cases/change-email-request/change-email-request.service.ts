import { Inject, Injectable } from "@nestjs/common"
import { EmailService } from "@shared/shared/utils/email/send-mail"
import { generateRandomToken } from "@shared/shared/utils/token-functions"
import { ProfileEntity } from "src/modules/profile/entities/profile.entity"
import { ProfilePrismaRepository } from "src/modules/profile/infra/prisma/profile.prisma.repository"
import { UserRoles } from "../../business/user.roles"
import { UserEntity } from "../../entities/user.entity"
import { IUserRepository } from "../../implementations/user.repository"
import { UserPrismaRepository } from "../../infra/prisma/user.prisma.repository"

@Injectable()
export class ChangeEmailRequestService extends UserRoles {
  constructor(
    @Inject(UserPrismaRepository)
    protected userRepository: IUserRepository,
    @Inject(ProfilePrismaRepository)
    protected profileRepository: ProfilePrismaRepository,
    @Inject(EmailService)
    private emailService: EmailService,
  ) {
    super()
  }

  async execute(user_id: string): Promise<void> {
    // clean the business roles cache
    this.clearErrors()

    const user: UserEntity = await this.userRepository.findById(user_id)
    const profile: ProfileEntity = await this.profileRepository.findByUserId(user_id)
    const existingToken: string = user?.email_change_token

    if (existingToken) {
      await this.userRepository.update(user?.id, { email_change_token: null })
    }

    const emailChangeToken = generateRandomToken(32)

    await this.userRepository.update(user.id, {
      email_change_token: emailChangeToken,
      email_change_sent_at: new Date(),
    })

    const link = `${process.env.CLIENT_URL}/auth/reset-email/?token=${emailChangeToken}`

    await this.emailService.sendEmail(
      user?.email,
      "Solicitação de redefinição de email",
      { name: profile?.name, link: link },
      "requestResetEmail",
    )
  }
}
