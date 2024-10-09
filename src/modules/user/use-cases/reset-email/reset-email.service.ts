import { Inject, Injectable } from "@nestjs/common"
import { EmailService } from "@shared/shared/utils/email/send-mail"
import { ProfileEntity } from "src/modules/profile/entities/profile.entity"
import { ProfilePrismaRepository } from "src/modules/profile/infra/prisma/profile.prisma.repository"
import { UserRoles } from "../../business/user.roles"
import { ResetEmailDto } from "../../dto/reset-email.dto"
import { UserEntity } from "../../entities/user.entity"
import { IUserRepository } from "../../implementations/user.repository"
import { UserPrismaRepository } from "../../infra/prisma/user.prisma.repository"

@Injectable()
export class ResetEmailService extends UserRoles {
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

  async execute(resetEmailDto: ResetEmailDto): Promise<void> {
    this.clearErrors()

    const user: UserEntity = await this.userRepository.findByChangeToken(
      resetEmailDto.token,
      "email",
    )

    await this.userTokenNotFound(user)

    const profile: ProfileEntity = await this.profileRepository.findByUserId(user?.id)
    const emailAlreadyExists: UserEntity = await this.userRepository.findByEmail(
      resetEmailDto.email,
    )

    await this.emailAlreadyExists(emailAlreadyExists)
    await this.userTokenNotEqual(user?.email_change_token !== resetEmailDto.token)
    await this.userNotFound(user)

    await this.userRepository.update(user?.id, {
      email: resetEmailDto?.email.toLowerCase(),
      email_change_token: null,
    })

    await this.emailService.sendEmail(
      user?.email,
      "Endereço de e-mail alterado",
      { name: profile?.name },
      "resetEmail",
    )
  }
}
