import { CompanyRepository } from "@modules/company/dao/company.repository";
import { PersonRepository } from "@modules/person/dao/person.repository";
import { PersonPermissionRepository } from "@modules/person_permission/dao/person-permission.repository";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { BusinessErrors } from "@shared/shared/utils/business-errors";
import { PrismaModule } from "src/database/prisma/prisma.module";
import { PrismaService } from "src/database/prisma/prisma.service";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthRoles } from "./business/auth.roles";
import { AuthRepository } from "./dao/auth.repository";

@Module({
  imports: [PrismaModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    PersonRepository,
    PersonPermissionRepository,
    CompanyRepository,
    AuthRepository,
    AuthRoles,
    BusinessErrors,
    PrismaService,
  ],
})
export class AuthModule {}
