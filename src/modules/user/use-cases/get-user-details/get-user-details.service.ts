import { Inject, Injectable } from "@nestjs/common"
import { UserRoles } from "../../business/user.roles"
import { IUserRepository } from "../../implementations/user.repository"
import { UserPrismaRepository } from "../../infra/prisma/user.prisma.repository"
import { UserWordUsageService } from "src/modules/user/use-cases/word-usage-status/user-word-usage.service"
import { ISubscriptionRepository } from "../../../subscription/implementations/subscription.repository"
import { SubscriptionPrismaRepository } from "../../../subscription/infra/prisma/subscription.prisma.repository"
import { SubscriptionEntity } from "../../../subscription/entities/subscriptions.entity"

@Injectable()
export class GetUserDetailsService extends UserRoles {
  constructor(
    @Inject(UserPrismaRepository)
    protected userRepository: IUserRepository,
    @Inject(SubscriptionPrismaRepository)
    protected subscriptionRepository: ISubscriptionRepository,
    private userWordUsageService: UserWordUsageService,
  ) {
    super()
  }

  async execute(user_id: string): Promise<any> {
    this.clearErrors()

    const [user, subscriptions, word_usage] = await Promise.all([
      this.userRepository.findByIdWithDetails(user_id),
      this.subscriptionRepository.findLastSubscription(user_id, {
        with: { plans: true },
      }),
      this.userWordUsageService.execute(user_id),
    ])

    user.subscription = subscriptions || SubscriptionEntity.placeholder()

    return {
      user,
      word_usage,
      subscriptions: subscriptions || SubscriptionEntity.placeholder(),
    }
  }
}
