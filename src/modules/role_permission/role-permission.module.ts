import { RoleRepository } from "@modules/role/dao/role.repository";
import { Module } from "@nestjs/common";
import { BusinessErrors } from "@shared/shared/utils/business-errors";
import { PrismaModule } from "src/database/prisma/prisma.module";
import { PrismaService } from "src/database/prisma/prisma.service";

import { RolePermissionRepository } from "./dao/role-permission.repository";
import { RolePermissionController } from "./role-permission.controller";
import { RolePermissionService } from "./role-permission.service";

@Module({
  imports: [PrismaModule],
  controllers: [RolePermissionController],
  providers: [
    RolePermissionService,
    RolePermissionRepository,
    RoleRepository,
    BusinessErrors,
    PrismaService,
  ],
})
export class RolePermissionModule {}
