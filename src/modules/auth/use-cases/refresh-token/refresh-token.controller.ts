import { Controller, Post, UseGuards } from "@nestjs/common"
import { GetCurrentUser, GetCurrentUserId, Public } from "src/modules/shared/decorators"
import { RtGuard } from "src/modules/shared/guards"
import { Tokens } from "../../types"
import { RefreshTokenService } from "./refresh-token.service"

@Controller("auth")
export class RefreshTokenController {
  constructor(private refreshTokenService: RefreshTokenService) {}

  @Public()
  @UseGuards(RtGuard)
  @Post("/refresh-token")
  async execute(
    @GetCurrentUserId() userId: string,
    @GetCurrentUser("refreshToken") refreshToken: string,
  ): Promise<Tokens> {
    const tokens = await this.refreshTokenService.execute(userId, refreshToken)

    return tokens
  }
}
