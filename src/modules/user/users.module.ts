import { Module } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { JwtService } from "@nestjs/jwt"
import { EmailService } from "@shared/shared/utils/email/send-mail"
import { BusinessErrors } from "src/modules/shared/utils/business-errors"
import { ProfilePrismaRepository } from "../profile/infra/prisma/profile.prisma.repository"
import { SubscriptionPrismaRepository } from "../subscription/infra/prisma/subscription.prisma.repository"
import { UserPrismaRepository } from "./infra/prisma/user.prisma.repository"
import { ChangeEmailRequestController } from "./use-cases/change-email-request/change-email-request.controller"
import { ChangeEmailRequestService } from "./use-cases/change-email-request/change-email-request.service"
import { ChangePasswordRequestController } from "./use-cases/change-password-request/change-password-request.controller"
import { ChangePasswordRequestService } from "./use-cases/change-password-request/change-password-request.service"
import { ChangePasswordController } from "./use-cases/change-password/change-password.controller"
import { ChangePasswordService } from "./use-cases/change-password/change-password.service"
import { ConfirmEmailController } from "./use-cases/confirm_email/confirm-email.controller"
import { ConfirmEmailService } from "./use-cases/confirm_email/confirm-email.service"
import { CreateUserController } from "./use-cases/create-user/create-user.controller"
import { CreateUserService } from "./use-cases/create-user/create-user.service"
import { ResendConfirmEmailController } from "./use-cases/resend_confirm_email/resend-confirm-email.controller"
import { ResendConfirmEmailService } from "./use-cases/resend_confirm_email/resend-confirm-email.service"
import { ResetEmailController } from "./use-cases/reset-email/reset-email.controller"
import { ResetEmailService } from "./use-cases/reset-email/reset-email.service"
import { ResetPasswordController } from "./use-cases/reset-password/reset-password.controller"
import { ResetPasswordService } from "./use-cases/reset-password/reset-password.service"
import { GetUserDetailsController } from "./use-cases/get-user-details/get-user-details.controller"
import { GetUserDetailsService } from "./use-cases/get-user-details/get-user-details.service"
import { GetUserExtractController } from "./use-cases/get-user-extract/get-user-extract.controller"
import { GetUserExtractService } from "./use-cases/get-user-extract/get-user-extract.service"
import { WordUsagePrismaRepository } from "../word-usage/infra/prisma/word-usage.prisma.repository"
import { UserWordUsageController } from "./use-cases/word-usage-status/user-word-usage.controller"
import { UserWordUsageService } from "./use-cases/word-usage-status/user-word-usage.service"
import { GetCompanyPromptsController } from "./use-cases/get-user-prompts/get-user-prompts.controller"
import { GetCompanyPromptsService } from "./use-cases/get-user-prompts/get-user-prompts.service"
import { GetUserByPhoneController } from "./use-cases/get-user-by-phone/get-user-by-phone.controller"
import { GetUserByPhoneService } from "./use-cases/get-user-by-phone/get-user-by-phone.service"
import { PhoneConfirmationService } from "./use-cases/phone-confirmation/phone-confirmation.service"
import { WhatsappService } from "../whatsapp/whatsapp.service"
import { AuthService } from "../auth/auth.service"
import { CreateStripeCustomerModule } from "@modules/global/stripe/use-cases/create-stripe-customer/create-stripe-customer.module"
import { ChargeUserCreditsModule } from "./use-cases/charge-user-credits/charge-user-credits.module"
import { ChargePreConditionModule } from "./use-cases/charge-pre-condition/charge-pre-condition.module"
import { PhoneConfirmationRequestModule } from "./use-cases/phone-confirmation-request/phone-confirmation-request.module"
import { PhoneController } from "./phone.controller"
import { PhoneConfirmationModule } from "./use-cases/phone-confirmation/phone-confirmation.module"
import { CreateTransactionRequestModule } from "@modules/transaction-requests/services/create-transaction-request/create-transaction-request.module"

@Module({
  imports: [
    CreateStripeCustomerModule,
    ChargeUserCreditsModule,
    ChargePreConditionModule,
    PhoneConfirmationRequestModule,
    PhoneConfirmationModule,
    CreateTransactionRequestModule,
  ],
  controllers: [
    ChangeEmailRequestController,
    ChangePasswordController,
    ChangePasswordRequestController,
    UserWordUsageController,
    CreateUserController,
    ResetEmailController,
    ResetPasswordController,
    ConfirmEmailController,
    ResendConfirmEmailController,
    GetUserDetailsController,
    GetUserExtractController,
    GetCompanyPromptsController,
    GetUserByPhoneController,
    PhoneController,
  ],
  providers: [
    BusinessErrors,
    ResendConfirmEmailService,
    ConfirmEmailService,
    ChangeEmailRequestService,
    ChangePasswordRequestService,
    ChangePasswordService,
    ConfigService,
    CreateUserService,
    EmailService,
    JwtService,
    GetUserDetailsService,
    GetUserExtractService,
    GetCompanyPromptsService,
    UserWordUsageService,
    ProfilePrismaRepository,
    ResetEmailService,
    ResetPasswordService,
    SubscriptionPrismaRepository,
    WordUsagePrismaRepository,
    UserPrismaRepository,
    GetUserByPhoneService,
    PhoneConfirmationService,
    WhatsappService,
    AuthService,
    ChargeUserCreditsModule,
  ],
})
export class UsersModule {}
