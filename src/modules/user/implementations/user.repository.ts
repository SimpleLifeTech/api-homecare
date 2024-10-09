import { CompanyPromptEntity } from "src/modules/prompt/entities/company-prompt.entity"
import { CreateUserDto } from "../dto/create-user.dto"
import { UpdateUserDto } from "../dto/update-user.dto"
import { UserEntity } from "../entities/user.entity"
import { IUserWordsEntity } from "../types/iuser-words-type"
import { Prisma } from "@prisma/client"

export interface IUserRepository {
  withTransaction(tx: Prisma.TransactionClient): IUserRepository

  create(data: CreateUserDto): Promise<UserEntity>

  update(user_id: string, data: UpdateUserDto): Promise<UserEntity>

  findByEmail(email: string): Promise<UserEntity>

  findByEmailLogin(email: string): Promise<IUserWordsEntity>

  findByPhone(phone: string): Promise<UserEntity>

  findById(id: string): Promise<UserEntity>

  findByChangeToken(
    token: string,
    tokenType: "email" | "phone" | "password" | "confirm",
  ): Promise<UserEntity>

  findByIdWithDetails(id: string): Promise<UserEntity>

  findUserWithWordUsage(user_id: string): Promise<IUserWordsEntity>

  getExtract(user_id: string): Promise<UserEntity>

  getCompanyPrompts(user_id: string, query: any): Promise<CompanyPromptEntity[]>

  incrementAdditionalCredits(userId: string, amount: number): Promise<void>

  decrementCredits(userId: string, amount: number): Promise<void>

  findByStripeId(stripeId: string): Promise<UserEntity | null>
}
