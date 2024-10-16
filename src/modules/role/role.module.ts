import { Module } from "@nestjs/common";
import { PrismaModule } from "src/database/prisma/prisma.module";
import { RoleController } from "./role.controller";
import { RoleService } from "./role.service";
import { RoleRepository } from "./dao/role.repository";
import { BusinessErrors } from "@shared/shared/utils/business-errors";
import { PrismaService } from "src/database/prisma/prisma.service";

@Module({
  imports: [PrismaModule],
  controllers: [RoleController],
  providers: [RoleService, RoleRepository, BusinessErrors, PrismaService],
})
export class RoleModule {}
