import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { users } from "@prisma/client"
import { Exclude, Expose } from "class-transformer"
import { ProfileEntity } from "../../profile/entities/profile.entity"
import {
  SubscriptionEntity,
  TSubscriptionEntity,
} from "../../subscription/entities/subscriptions.entity"
import { period } from "@libs/helpers"
import { AffiliateEntity } from "#cms/affiliates.cms/entities/affiliate.entity"

export type TUserEntity = users & {
  subscriptions?: TSubscriptionEntity[] | null
  subscription?: TSubscriptionEntity | null
}

export class UserEntity implements users {
  @ApiProperty()
  id: string

  @ApiPropertyOptional()
  banned_until: Date | null

  @ApiProperty()
  created_at: Date

  @ApiPropertyOptional()
  deleted_at: Date | null

  @ApiPropertyOptional()
  confirmed_at: Date | null

  @ApiProperty()
  email: string
  name: string | null

  @ApiPropertyOptional()
  email_change_sent_at: Date | null

  @ApiPropertyOptional()
  email_change_token: string | null

  @ApiPropertyOptional()
  email_confirm_token: string | null

  @ApiPropertyOptional()
  email_confirm_sent_at: Date | null

  @ApiPropertyOptional()
  @Exclude()
  hashedRt: string | null

  @ApiPropertyOptional()
  invited_at: Date | null

  @ApiPropertyOptional()
  is_admin: boolean | null

  @ApiPropertyOptional()
  last_sign_in_at: Date | null

  @ApiProperty()
  @Exclude()
  password: string

  @ApiPropertyOptional()
  password_change_token: string | null

  @ApiPropertyOptional()
  password_change_sent_at: Date | null

  @ApiPropertyOptional()
  updated_at: Date | null

  @ApiPropertyOptional()
  image_url: string | null

  @ApiPropertyOptional()
  profile?: ProfileEntity | null

  @ApiProperty() role: string

  @Exclude() stripeId: string
  referralCode: string | null
  referredById: string | null
  phone: string

  planCredits: number
  additionalCredits: number

  emailConfirmedAt: Date | null
  phoneConfirmedAt: Date | null

  subscriptions: SubscriptionEntity[] | null

  subscription: SubscriptionEntity
  @Exclude() affiliate: AffiliateEntity

  @Expose()
  get isAffiliate() {
    return Boolean(this.affiliate)
  }

  @Expose()
  get totalCredits() {
    return this.planCredits + this.additionalCredits
  }

  @Expose()
  get hasCredits() {
    return this.totalCredits > 0
  }

  @Expose()
  get usedCredits() {
    if (this.subscription) {
      return this.subscription.availableCredits - this.planCredits
    }
    return null
  }

  @Expose()
  get isFreemium(): boolean {
    return !this.hasCredits || !this.subscription?.active
  }

  @Expose()
  get isNewbie(): boolean {
    return this.usedCredits === 0 && this.created_at >= new Date(Date.now() - period.DAY_1)
  }

  constructor(partial: Partial<TUserEntity>) {
    Object.assign(this, {
      ...partial,
      subscriptions: partial.subscriptions?.map((subscription) => {
        return new SubscriptionEntity(subscription)
      }),
    })
  }
  static make(partial: Partial<TUserEntity>) {
    return new UserEntity(partial)
  }

  static makeNullable(partial: Partial<TUserEntity> | null): UserEntity | null {
    return partial ? UserEntity.make(partial) : null
  }

  static fromArray(entries: Partial<TUserEntity>[]) {
    return entries.map(UserEntity.make)
  }
}
