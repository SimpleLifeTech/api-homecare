import { BranchRepository } from "@modules/branch/dao/branch.repository";
import { Module } from "@nestjs/common";
import { BusinessErrors } from "@shared/shared/utils/business-errors";
import { PrismaModule } from "src/database/prisma/prisma.module";
import { PrismaService } from "src/database/prisma/prisma.service";

import { HomecareRepository } from "./dao/homecare.repository";
import { HomecareController } from "./homecare.controller";
import { HomecareService } from "./homecare.service";
import { BranchRoles } from "@modules/branch/business/branch.roles";

@Module({
  imports: [PrismaModule],
  controllers: [HomecareController],
  providers: [
    HomecareService,
    HomecareRepository,
    BranchRepository,
    BranchRoles,
    BusinessErrors,
    PrismaService,
  ],
})
export class HomecareModule {}
