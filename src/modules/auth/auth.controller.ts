import { Body, Controller, Post } from "@nestjs/common";

import { AuthService } from "./auth.service";
import { LoginDTO } from "./dto/login.dto";

@Controller("auth")
export class AuthController {
  constructor(protected readonly authService: AuthService) {}

  @Post("/login")
  async login(@Body() data: LoginDTO) {
    return this.authService.login(data);
  }
}
