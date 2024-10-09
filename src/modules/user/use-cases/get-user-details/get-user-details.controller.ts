import { Controller, Get } from "@nestjs/common"
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger"
import { GetCurrentUserId } from "@shared/shared/decorators"
import { UserEntity } from "../../entities/user.entity"
import { GetUserDetailsService } from "./get-user-details.service"

@ApiTags("User")
@Controller("user")
export class GetUserDetailsController {
  constructor(private getUserDetails: GetUserDetailsService) {}

  @ApiOperation({ summary: "Lista detalhes do usuario como as redes sociais e a empresa" })
  @ApiBearerAuth()
  @Get("/me")
  async execute(@GetCurrentUserId() user_id: string): Promise<UserEntity> {
    return await this.getUserDetails.execute(user_id)
  }
}
