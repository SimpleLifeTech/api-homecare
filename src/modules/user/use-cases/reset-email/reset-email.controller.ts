import { Body, Controller, HttpStatus, Post, Res } from "@nestjs/common"

import { Response } from "express"
import { Public } from "src/modules/shared/decorators"
import { ResetEmailDto } from "../../dto/reset-email.dto"
import { ResetEmailService } from "./reset-email.service"

@ApiTags("User")
@Controller("user")
export class ResetEmailController {
  constructor(private resetEmailService: ResetEmailService) {}

  @ApiOperation({ summary: "Alterar e-mail do usuário" })
  @ApiBody({
    type: ResetEmailDto,
  })
  @Public()
  @Post("change-email/reset/disabled")
  async execute(@Body() reset_email_dto: ResetEmailDto, @Res() res: Response): Promise<void> {
    await this.resetEmailService.execute(reset_email_dto)

    res.status(HttpStatus.OK).json({
      message: "Endereço de e-mail alterado com sucesso",
      statusCode: HttpStatus.OK,
    })
  }
}
