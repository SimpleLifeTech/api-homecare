import { Inject, Injectable } from "@nestjs/common"
import { UserRoles } from "../../business/user.roles"
import { UserEntity } from "../../entities/user.entity"
import { IUserRepository } from "../../implementations/user.repository"
import { UserPrismaRepository } from "../../infra/prisma/user.prisma.repository"
import { SubscriptionPrismaRepository } from "src/modules/subscription/infra/prisma/subscription.prisma.repository"
import { ISubscriptionRepository } from "src/modules/subscription/implementations/subscription.repository"
import { PrismaService } from "@prisma/prisma/prisma.service"
import { CodeEmailConfirmationNotFound } from "@modules/user/exceptions/CodeEmailConfirmationNotFound"
import { CodeEmailConfirmationExpired } from "@modules/user/exceptions/CodeEmailConfirmationExpired"
const CONFIRMATION_TYPE = "email-confirmation"
@Injectable()
export class ConfirmEmailService extends UserRoles {
  constructor(
    @Inject(UserPrismaRepository)
    protected userRepository: IUserRepository,
    @Inject(SubscriptionPrismaRepository)
    protected subscriptionRepository: ISubscriptionRepository,
    private prisma: PrismaService,
  ) {
    super()
  }

  async execute(code: string): Promise<void> {
    // clean the business roles cache
    this.clearErrors()

    const transaction = await this.prisma.transactionRequest.findFirst({
      where: {
        type: CONFIRMATION_TYPE,
        code,
        deletedAt: null,
      },
      orderBy: { createdAt: "desc" },
    })

    if (!transaction) throw new CodeEmailConfirmationNotFound()
    if (transaction.expiresAt < new Date()) throw new CodeEmailConfirmationExpired()

    const { email } = transaction.payload as { email: string }
    const user: UserEntity = await this.userRepository.findByEmail(email)

    await this.userNotFound(user)
    await this.userHasBeenDeleted(user?.deleted_at)

    const { id: userId } = user

    await this.prisma.$transaction(async (tx) => {
      await Promise.all([
        tx.transactionRequest.update({
          where: { id: transaction.id },
          data: { deletedAt: new Date() },
        }),
        tx.users.update({
          where: { id: userId },
          data: {
            emailConfirmedAt: new Date(),
            confirmed_at: new Date(),
          },
        }),
      ])
    })
  }
}
