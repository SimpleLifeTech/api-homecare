import { Body, Controller, HttpStatus, Post, Res } from "@nestjs/common"
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger"
import { Response } from "express"
import { Public } from "src/modules/shared/decorators"
import { ResetPasswordDto } from "../../dto/reset-password.dto"
import { ResetPasswordService } from "./reset-password.service"

@ApiTags("User")
@Controller("user")
export class ResetPasswordController {
  constructor(private resetPasswordService: ResetPasswordService) {}

  @ApiOperation({ summary: "Alterar senha do usuário" })
  @ApiBody({
    type: ResetPasswordDto,
  })
  @Public()
  @Post("change-password/reset")
  async execute(
    @Body() request_password_dto: ResetPasswordDto,
    @Res() res: Response,
  ): Promise<void> {
    await this.resetPasswordService.execute(request_password_dto)

    res.status(HttpStatus.OK).json({
      message: "Senha alterada com sucesso",
      statusCode: HttpStatus.OK,
    })
  }
}
