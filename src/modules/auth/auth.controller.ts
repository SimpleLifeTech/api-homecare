import { Body, Controller, Post, Res } from "@nestjs/common";
import { Response } from "express";

import { LoginDTO } from "./dto/login.dto";
import { AuthService } from "./auth.service";
@Controller("auth")
export class AuthController {
  constructor(protected readonly authService: AuthService) {}

  @Post("/login")
  async login(@Body() data: LoginDTO, @Res({ passthrough: true }) res: Response) {
    const { codeHttp, ...response } = await this.authService.login(data);

    res.status(codeHttp).json(response);
  }
}
