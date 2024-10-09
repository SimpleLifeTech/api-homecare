import { Controller, HttpStatus, Post, Res, UseGuards } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger"
import { Response } from "express"
import { GetCurrentUserId } from "src/modules/shared/decorators/get-current-user-id.decorator"
import { LogoutService } from "./logout.service"

@ApiTags("User")
@Controller("auth")
export class LogoutController {
  constructor(private logoutService: LogoutService) {}

  @ApiOperation({ summary: "Realizar logout" })
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @Post("/logout")
  async execute(@GetCurrentUserId() user_id: string, @Res() res: Response): Promise<void> {
    await this.logoutService.execute(user_id)

    res.status(HttpStatus.OK).json({
      message: "Usuário deslogado com sucesso",
      statusCode: HttpStatus.OK,
    })
  }
}
