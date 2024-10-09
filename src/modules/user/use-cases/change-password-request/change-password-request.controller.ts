import { Body, Controller, HttpStatus, Post, Res } from "@nestjs/common"

import { Public } from "@shared/shared/decorators"
import { Response } from "express"
import { ChangePasswordRequestDto } from "../../dto/change-password-request"
import { ChangePasswordRequestService } from "./change-password-request.service"

@ApiTags("User")
@Controller("user")
export class ChangePasswordRequestController {
  constructor(private changePasswordRequestService: ChangePasswordRequestService) {}

  @ApiOperation({ summary: "Solicitar e-mail para alteração de senha do usuário" })
  @ApiBody({
    type: ChangePasswordRequestDto,
  })
  @Public()
  @Post("change-password-request")
  async execute(
    @Body() change_password_request_dto: ChangePasswordRequestDto,
    @Res() res: Response,
  ): Promise<void> {
    await this.changePasswordRequestService.execute(change_password_request_dto)

    res.status(HttpStatus.OK).json({
      message: "E-mail enviado para alteração de senha do usuário com sucesso",
      statusCode: HttpStatus.OK,
    })
  }
}
