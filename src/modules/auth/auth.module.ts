import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { BusinessErrors } from "@shared/shared/utils/business-errors";
import { PrismaModule } from "src/database/prisma/prisma.module";
import { PrismaService } from "src/database/prisma/prisma.service";

import { AuthRoles } from "./business/auth.roles";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthRepository } from "./dao/auth.repository";
import { PersonRepository } from "@modules/person/dao/person.repository";

@Module({
  imports: [PrismaModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    PersonRepository,
    AuthRepository,
    AuthRoles,
    BusinessErrors,
    PrismaService,
  ],
})
export class AuthModule {}
