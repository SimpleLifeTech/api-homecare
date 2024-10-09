import { Controller, HttpStatus, Param, Post, Res } from "@nestjs/common"
import { ApiOperation, ApiTags } from "@nestjs/swagger"
import { Public } from "@shared/shared/decorators"
import { Response } from "express"
import { ConfirmEmailService } from "./confirm-email.service"

@ApiTags("User")
@Controller("user")
export class ConfirmEmailController {
  constructor(private confirmEmailService: ConfirmEmailService) {}

  @ApiOperation({ summary: "Confirmar email do usuário" })
  @Public()
  @Post("confirm-email/:email_confirm_token")
  async execute(
    @Param("email_confirm_token") email_confirm_token: string,
    @Res() res: Response,
  ): Promise<void> {
    await this.confirmEmailService.execute(email_confirm_token)

    res.status(HttpStatus.OK).json({
      message: "Endereço de e-mail confirmado com sucesso",
      statusCode: HttpStatus.OK,
    })
  }
}
