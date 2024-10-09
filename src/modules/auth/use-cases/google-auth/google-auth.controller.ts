import { Controller, Get, Req, UseGuards } from "@nestjs/common"
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger"
import { Public } from "src/modules/shared/decorators"
import { AuthDto } from "../../dto/auth.dto"
import { GoogleOAuthGuard } from "../../guards/google-oauth.guard"
import { GoogleAuthService } from "./google-auth.service"
import { IResponseLogin } from "../../types/response-login.type"

@ApiTags("User")
@Controller("auth")
export class GoogleAuthController {
  constructor(private googleAuthService: GoogleAuthService) {}

  @ApiOperation({ summary: "Entrar ou criar conta com Google Auth" })
  @ApiBody({
    type: AuthDto,
  })
  @Public()
  @Get("/google")
  @UseGuards(GoogleOAuthGuard)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async auth() {}

  @Public()
  @Get("google/callback")
  @UseGuards(GoogleOAuthGuard)
  async googleAuthCallback(@Req() req): Promise<IResponseLogin> {
    const tokens = await this.googleAuthService.execute(req.user)

    return tokens
  }

  @Public()
  @Get("google/verify-code")
  async googleVerifyCode(@Req() req): Promise<IResponseLogin> {
    return this.googleAuthService.verifyCode(req.query.code)
  }
}
