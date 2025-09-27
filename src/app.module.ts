import { AuthModule } from "@modules/auth/auth.module";
import { BranchModule } from "@modules/branch/branch.module";
import { CareServiceTypeModule } from "@modules/care_service_type/care-service-type.module";
import { CompanyModule } from "@modules/company/company.module";
import { CompanyFictionalModule } from "@modules/company_fictional/company-fictional.module";
import { DepartmentModule } from "@modules/department/department.module";
import { EmployeeModule } from "@modules/employee/employee.module";
import { PersonModule } from "@modules/person/person.module";
import { RoleModule } from "@modules/role/role.module";
import { RolePermissionModule } from "@modules/role_permission/role-permission.module";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { CacheRepositoryModule } from "@shared/shared/cache/cache.module";
import { CustomLogger } from "@shared/shared/logs/custom.logger";
import { LoggerModule } from "nestjs-pino";

import { AppController } from "./app.controller";
import { PrismaService } from "./database/prisma/prisma.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    BranchModule,
    CacheRepositoryModule,
    CareServiceTypeModule,
    CompanyModule,
    CompanyFictionalModule,
    DepartmentModule,
    EmployeeModule,
    PersonModule,
    RoleModule,
    RolePermissionModule,
    LoggerModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [CustomLogger, PrismaService],
  exports: [CustomLogger],
})
export class AppModule {}
