import { Body, Controller, Post } from "@nestjs/common"
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger"
import { Public } from "src/modules/shared/decorators"
import { CreateUserDto } from "../../dto/create-user.dto"
import { UserEntity } from "../../entities/user.entity"
import { CreateUserService } from "./create-user.service"
import { CreateUserRdDto } from "../../dto/create-user-rd.dto"
import { Tokens } from "../../../auth/types"

@ApiTags("User")
@Controller("user")
export class CreateUserController {
  constructor(private createUsersService: CreateUserService) {}

  @ApiOperation({ summary: "Criar usuário" })
  @ApiBody({
    type: CreateUserDto,
  })
  @Public()
  @Post("/signup")
  async execute(@Body() create_user_dto: CreateUserDto): Promise<UserEntity> {
    return await this.createUsersService.execute(create_user_dto)
  }

  @ApiOperation({ summary: "Criar usuário pelo form RD station" })
  @ApiBody({
    type: CreateUserRdDto,
  })
  @Public()
  @Post("/rd-signup")
  async create(
    @Body() create_user_rd_dto: CreateUserRdDto,
  ): Promise<{ user: UserEntity } & Tokens> {
    return await this.createUsersService.create(create_user_rd_dto)
  }
}
