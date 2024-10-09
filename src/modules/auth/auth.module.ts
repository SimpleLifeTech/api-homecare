import { Module } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { JwtModule } from "@nestjs/jwt"
import { AuthController } from "./auth.controller"
import { AuthService } from "./auth.service"
import { AtStrategy, GoogleStrategy, RtStrategy } from "./strategies"
import { GoogleAuthController } from "./use-cases/google-auth/google-auth.controller"
import { GoogleAuthService } from "./use-cases/google-auth/google-auth.service"
import { LoginController } from "./use-cases/login/login.controller"
import { LoginService } from "./use-cases/login.service"
import { LogoutController } from "./use-cases/logout/logout.controller"
import { LogoutService } from "./use-cases/logout/logout.service"
import { RefreshTokenController } from "./use-cases/refresh-token/refresh-token.controller"
import { RefreshTokenService } from "./use-cases/refresh-token/refresh-token.service"
import { UserPrismaRepository } from "../user/infra/prisma/user.prisma.repository"
import { ProfilePrismaRepository } from "../profile/infra/prisma/profile.prisma.repository"
import { OAuth2Client } from "google-auth-library"
import { LoginWppService } from "./use-cases/login/wpplogin.service"
import { LoginWppController } from "./use-cases/login/wpplogin.controller"
import { CreateStripeCustomerModule } from "@modules/global/stripe/use-cases/create-stripe-customer/create-stripe-customer.module"

@Module({
  providers: [
    AuthService,
    AtStrategy,
    RtStrategy,
    GoogleStrategy,
    ConfigService,
    LoginService,
    LoginWppService,
    LogoutService,
    GoogleAuthService,
    RefreshTokenService,
    UserPrismaRepository,
    ProfilePrismaRepository,
    OAuth2Client,
  ],
  controllers: [
    AuthController,
    LoginController,
    LoginWppController,
    LogoutController,
    GoogleAuthController,
    RefreshTokenController,
  ],
  imports: [JwtModule.register({}), CreateStripeCustomerModule],
})
export class AuthModule {}
