import { BranchModule } from "@modules/branch/branch.module";
import { CompanyModule } from "@modules/company/company.module";
import { PersonModule } from "@modules/person/person.module";
import { RoleModule } from "@modules/role/role.module";
import { RolePermissionModule } from "@modules/role_permission/role-permission.module";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_FILTER } from "@nestjs/core";
import { HttpExceptionFilter } from "@shared/shared/utils/errors/http-exeception.filter";

import { AppController } from "./app.controller";
import { PrismaService } from "./database/prisma/prisma.service";

@Module({
  imports: [
    ConfigModule.forRoot(),
    BranchModule,
    CompanyModule,
    PersonModule,
    RoleModule,
    RolePermissionModule,
  ],
  controllers: [AppController],
  providers: [
    PrismaService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
