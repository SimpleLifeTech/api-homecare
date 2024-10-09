import { Controller, HttpStatus, Post, Res } from "@nestjs/common"
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger"
import { GetCurrentUserId } from "@shared/shared/decorators"
import { Response } from "express"
import { ChangeEmailRequestService } from "./change-email-request.service"

@ApiTags("User")
@Controller("user")
export class ChangeEmailRequestController {
  constructor(private changeEmailRequestService: ChangeEmailRequestService) {}

  @ApiOperation({ summary: "Solicitar e-mail para alteração de e-mail do usuário" })
  @ApiBearerAuth()
  @Post("change-email-request")
  async execute(@GetCurrentUserId() user_id: string, @Res() res: Response): Promise<void> {
    await this.changeEmailRequestService.execute(user_id)

    res.status(HttpStatus.OK).json({
      message: "E-mail enviado para alteração de e-mail do usuário com sucesso",
      statusCode: HttpStatus.OK,
    })
  }
}
