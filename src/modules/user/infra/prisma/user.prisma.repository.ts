import { Injectable, Query } from "@nestjs/common"
import { PrismaService } from "@prisma/prisma/prisma.service"
import { CreateUserDto } from "../../dto/create-user.dto"
import { UpdateUserDto } from "../../dto/update-user.dto"
import { UserEntity } from "../../entities/user.entity"
import { IUserRepository } from "../../implementations/user.repository"

import { generateRandomToken } from "@shared/shared/utils/token-functions"
import * as bcrypt from "bcrypt"
import { IUserWordsEntity } from "../../types/iuser-words-type"
import { CompanyPromptEntity } from "src/modules/prompt/entities/company-prompt.entity"
import { Prisma } from "@prisma/client"
import { generateRandReferralCode } from "@libs/helpers/string"

@Injectable()
export class UserPrismaRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}

  withTransaction(tx: Prisma.TransactionClient): IUserRepository {
    return new UserPrismaRepository(tx as PrismaService)
  }

  async decrementCredits(userId: string, amount: number): Promise<void> {
    const user = await this.findById(userId)
    await this.prisma.users.update({
      where: { id: userId },
      data: {
        additionalCredits: {
          decrement: Math.min(user.additionalCredits, amount),
        },
        planCredits: {
          decrement: Math.max(0, amount - user.additionalCredits),
        },
      },
    })
  }

  async findByStripeId(stripeId: string): Promise<UserEntity | null> {
    const user = await this.prisma.users.findFirst({ where: { stripeId } })

    if (user) {
      return new UserEntity(user)
    }

    const subscription = await this.prisma.subscriptions.findFirst({
      where: { stripe_customer_id: stripeId },
    })

    if (!subscription) {
      return null
    }

    return this.prisma.users
      .findUnique({
        where: { id: subscription.user_id },
      })
      .then((res) => res && new UserEntity(res))
  }

  async create(data: CreateUserDto): Promise<UserEntity> {
    const hashedPassword = await bcrypt.hash(data.password, 10)

    const subscriptionEndsAt = new Date()
    subscriptionEndsAt.setDate(subscriptionEndsAt.getDate() + 7)

    return this.prisma.users
      .create({
        data: {
          email: data.email.toLowerCase(),
          password: hashedPassword,
          email_confirm_token: data?.confirmed_at ? null : generateRandomToken(32),
          email_confirm_sent_at: new Date(),
          confirmed_at: data?.confirmed_at,
          image_url: data?.image_url,
          name: data.name,
          phone: data.phone,
          stripeId: data.stripeId,
          phoneConfirmedAt: data.phoneConfirmedAt,
          planCredits: 4000, // TODO:: Melhorar isso pra pegar automático do plano free.
          referralCode: generateRandReferralCode(Date.now()),
          referredById: data.referredById,
          profile: {
            create: {
              email: data.email.toLowerCase(),
              name: data.name,
              phone: data?.phone,
            },
          },
          word_usage: {
            create: {
              word_quantity: 0,
            },
          },
          subscriptions: {
            create: {
              // user_email: data.email.toLowerCase(),
              plan_id: 10,
              planCredits: 4000, // TODO:: Melhorar isso pra pegar automático do plano free.
              // endsAt: subscriptionEndsAt,
              // trialEndsAt: subscriptionEndsAt,
            },
          },
        },
        include: {
          profile: true,
          word_usage: true,
          subscriptions: true,
        },
      })
      .then((res) => res && new UserEntity(res))
  }

  async update(userId: string, data: UpdateUserDto): Promise<UserEntity> {
    const hashedPassword = data.password ? await bcrypt.hash(data.password, 10) : undefined

    return this.prisma.users
      .update({
        where: {
          id: userId,
        },
        data: {
          ...data,
          password: hashedPassword,
        },
      })
      .then((res) => res && new UserEntity(res))
  }

  async findByEmail(email: string): Promise<UserEntity> {
    return this.prisma.users
      .findFirst({
        where: {
          email: {
            equals: email,
            mode: "insensitive",
          },
          deleted_at: null,
        },
        include: {
          profile: true,
        },
      })
      .then((res) => res && new UserEntity(res))
  }

  async findByEmailLogin(email: string): Promise<IUserWordsEntity> {
    return this.prisma.users.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
      include: {
        profile: true,
        word_usage: true,
        subscriptions: {
          include: {
            plans: true,
          },
        },
      },
    })
  }

  async findByPhone(phone: string): Promise<UserEntity> {
    const profile = await this.prisma.profile.findFirst({
      where: {
        phone,
      },
    })

    if (profile.user_id) {
      return this.findById(profile.user_id)
    }
  }

  async findById(user_id: string): Promise<UserEntity> {
    return this.prisma.users
      .findUnique({
        where: {
          id: user_id,
        },
      })
      .then((res) => res && new UserEntity(res))
  }

  async findByChangeToken(
    token: string,
    tokenType: "email" | "phone" | "password" | "confirm",
  ): Promise<UserEntity> {
    switch (tokenType) {
      case "email":
        return this.prisma.users
          .findFirst({
            where: {
              email_change_token: token,
            },
          })
          .then((res) => res && new UserEntity(res))
      // case 'phone':
      //   return this.prisma.users.findFirst({
      //     where: {
      //       phone_change_token: token,
      //     },
      //   })
      case "password":
        return this.prisma.users
          .findFirst({
            where: {
              password_change_token: token,
            },
          })
          .then((res) => res && new UserEntity(res))
      case "confirm":
        return this.prisma.users
          .findFirst({
            where: {
              email_confirm_token: token,
            },
          })
          .then((res) => res && new UserEntity(res))
      default:
        throw new Error(`Tipo de token ${tokenType} não suportado`)
    }
  }

  async findByIdWithDetails(user_id: string): Promise<UserEntity> {
    return this.prisma.users
      .findUnique({
        where: {
          id: user_id,
        },
        include: {
          affiliate: true,
          profile: true,
          company: {
            include: {
              company_sector: true,
              company_size: true,
            },
            where: {
              deleted_at: null,
            },
            orderBy: {
              id: "desc",
            },
          },
          user_social_media: true,
        },
      })
      .then((res) => res && new UserEntity(res))
  }

  async findUserWithWordUsage(user_id: string): Promise<IUserWordsEntity> {
    return this.prisma.users.findUnique({
      where: {
        id: user_id,
      },
      include: {
        profile: true,
        word_usage: true,
        subscriptions: {
          orderBy: { created_at: "desc" },
          include: {
            plans: true,
          },
        },
      },
    })
  }

  async getExtract(user_id: string): Promise<UserEntity> {
    return this.prisma.users
      .findUnique({
        where: {
          id: user_id,
        },
        include: {
          profile: true,
          word_usage: true,
          subscriptions: {
            include: {
              plans: true,
            },
          },
          company_prompt: {
            include: {
              prompts: true,
            },
            orderBy: {
              created_at: "desc",
            },
          },
        },
      })
      .then((res) => res && UserEntity.make(res))
  }

  async getCompanyPrompts(user_id: string, @Query() query): Promise<CompanyPromptEntity[]> {
    return this.prisma.company_prompt.findMany({
      where: {
        user_id: user_id,
        save: query.save ? Boolean(query.save) : undefined,
        like: query.like ? Boolean(query.like) : undefined,
        dislike: query.dislike ? Boolean(query.dislike) : undefined,
        company_id: query.company_id ? String(query.company_id) : undefined,
      },
      include: {
        prompts: true,
      },
    })
  }

  async incrementAdditionalCredits(userId: string, amount: number): Promise<void> {
    await this.prisma.users.update({
      where: { id: userId },
      data: { additionalCredits: { increment: amount } },
    })
  }
}
