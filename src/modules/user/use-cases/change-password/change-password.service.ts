import { Inject, Injectable } from "@nestjs/common"
import { UserRoles } from "../../business/user.roles"
import { ChangePasswordDto } from "../../dto/change-password.dto"
import { UserEntity } from "../../entities/user.entity"
import { IUserRepository } from "../../implementations/user.repository"
import { UserPrismaRepository } from "../../infra/prisma/user.prisma.repository"

import * as bcrypt from "bcrypt"

@Injectable()
export class ChangePasswordService extends UserRoles {
  constructor(
    @Inject(UserPrismaRepository)
    protected userRepository: IUserRepository,
  ) {
    super()
  }

  async execute(user_id: string, change_password_dto: ChangePasswordDto): Promise<void> {
    // clean the business roles cache
    this.clearErrors()

    const { old_password: oldPassword, new_password: newPassword } = change_password_dto

    const user: UserEntity = await this.userRepository.findById(user_id)

    const passwordMatch = await bcrypt.compareSync(oldPassword, user.password)

    await this.passwordDoesNotMatch(passwordMatch)

    await this.userRepository.update(user_id, { password: newPassword })
  }
}
