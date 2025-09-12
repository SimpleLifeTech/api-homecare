import { Module } from "@nestjs/common";
import { PrismaModule } from "src/database/prisma/prisma.module";
import { PrismaService } from "src/database/prisma/prisma.service";

import { RoleRepository } from "./dao/role.repository";
import { RoleController } from "./role.controller";
import { RoleService } from "./role.service";

@Module({
  imports: [PrismaModule],
  controllers: [RoleController],
  providers: [RoleService, RoleRepository, PrismaService],
})
export class RoleModule {}
