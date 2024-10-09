import { Body, Controller, HttpStatus, Post, Res } from "@nestjs/common"

import { Public } from "@shared/shared/decorators"
import { Response } from "express"
import { ResendConfirmEmailDto } from "../../dto/resend-confirm-email.dto"
import { ResendConfirmEmailService } from "./resend-confirm-email.service"

@ApiTags("User")
@Controller("user")
export class ResendConfirmEmailController {
  constructor(private resendConfirmEmailService: ResendConfirmEmailService) {}

  @ApiOperation({ summary: "Re-enviar confirmação de email do usuário" })
  @ApiBody({
    type: ResendConfirmEmailDto,
  })
  @Public()
  @Post("resend-confirm-email")
  async execute(
    @Body() resend_confirm_email_dto: ResendConfirmEmailDto,

    @Res() res: Response,
  ): Promise<void> {
    await this.resendConfirmEmailService.execute(resend_confirm_email_dto)

    res.status(HttpStatus.OK).json({
      message: "E-mail de confirmação de conta re-enviado com sucesso",
      statusCode: HttpStatus.OK,
    })
  }
}
