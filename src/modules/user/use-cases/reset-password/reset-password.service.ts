import { Inject, Injectable } from "@nestjs/common"
import { EmailService } from "@shared/shared/utils/email/send-mail"
import { ProfileEntity } from "src/modules/profile/entities/profile.entity"
import { ProfilePrismaRepository } from "src/modules/profile/infra/prisma/profile.prisma.repository"
import { UserRoles } from "../../business/user.roles"
import { ResetPasswordDto } from "../../dto/reset-password.dto"
import { IUserRepository } from "../../implementations/user.repository"
import { UserPrismaRepository } from "../../infra/prisma/user.prisma.repository"
import { PrismaService } from "@prisma/prisma/prisma.service"
import { UserEntity } from "@modules/user/entities/user.entity"
import { CodeChangePasswordNotFound } from "@modules/user/exceptions/CodeChangePasswordNotFound"
import { CodeChangePasswordExpired } from "@modules/user/exceptions/CodeChangePasswordExpired"
import * as bcrypt from "bcrypt"

const CONFIRMATION_TYPE = "change-password"

@Injectable()
export class ResetPasswordService extends UserRoles {
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

  async execute({ token, password }: ResetPasswordDto): Promise<void> {
    // clean the business roles cache
    this.clearErrors()
    const transaction = await this.prisma.transactionRequest.findFirst({
      where: {
        type: CONFIRMATION_TYPE,
        code: token,
        deletedAt: null,
      },
      orderBy: { createdAt: "desc" },
    })

    if (!transaction) throw new CodeChangePasswordNotFound()
    if (transaction.expiresAt < new Date()) throw new CodeChangePasswordExpired()

    const { userEmail } = transaction.payload as { userEmail: string }
    const user: UserEntity = await this.userRepository.findByEmail(userEmail)
    await this.userNotFound(user)

    const profile: ProfileEntity = await this.profileRepository.findByUserId(user?.id)

    await this.userHasBeenDeleted(user?.deleted_at)
    const hashedPassword = await bcrypt.hash(password, 10)

    await this.prisma.$transaction([
      this.prisma.transactionRequest.update({
        where: { id: transaction.id },
        data: { deletedAt: new Date() },
      }),
      this.prisma.users.update({
        where: { id: user?.id },
        data: { password: hashedPassword, updated_at: new Date() },
      }),
    ])

    await this.emailService.sendEmail(
      user?.email,
      "Senha de usuário redefinida",
      { name: profile?.name, link: `${process.env.CLIENT_URL}` },
      "resetPassword",
    )
  }
}
