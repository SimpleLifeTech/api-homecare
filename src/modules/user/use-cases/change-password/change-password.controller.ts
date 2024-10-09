import { Body, Controller, HttpStatus, Put, Res } from "@nestjs/common"
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger"
import { Response } from "express"
import { GetCurrentUserId } from "src/modules/shared/decorators"
import { ChangePasswordDto } from "../../dto/change-password.dto"
import { ChangePasswordService } from "./change-password.service"

@ApiTags("User")
@Controller("user")
export class ChangePasswordController {
  constructor(private changePasswordService: ChangePasswordService) {}

  @ApiOperation({ summary: "Trocar senha com usuário logado" })
  @ApiBody({
    type: ChangePasswordDto,
  })
  @ApiBearerAuth()
  @Put("/change-password")
  async execute(
    @GetCurrentUserId() user_id: string,
    @Body() change_password_dto: ChangePasswordDto,
    @Res() res: Response,
  ): Promise<void> {
    await this.changePasswordService.execute(user_id, change_password_dto)

    res
      .status(HttpStatus.OK)
      .json({ message: "Senha do usuário alterada com sucesso", statusCode: HttpStatus.OK })
  }
}
