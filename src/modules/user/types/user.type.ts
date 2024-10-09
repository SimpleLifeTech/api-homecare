import { ProfileEntity } from "src/modules/profile/entities/profile.entity"
import { UserEntity } from "../entities/user.entity"
import { SubscriptionEntity } from "src/modules/subscription/entities/subscriptions.entity"
import { WordUsageEntity } from "src/modules/word-usage/entities/word-usage.entity"

export interface ICreateUserResponse {
  user: UserEntity
  profile: ProfileEntity
  subscription: SubscriptionEntity
  wordUsage: WordUsageEntity
}
