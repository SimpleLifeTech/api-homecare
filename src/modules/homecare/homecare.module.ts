import { BranchRepository } from "@modules/branch/dao/branch.repository";
import { Module } from "@nestjs/common";
import { BusinessErrors } from "@shared/shared/utils/business-errors";
import { PrismaModule } from "src/database/prisma/prisma.module";
import { PrismaService } from "src/database/prisma/prisma.service";

import { HomecareRepository } from "./dao/homecare.repository";
import { HomecareController } from "./homecare.controller";
import { HomecareService } from "./homecare.service";

@Module({
  imports: [PrismaModule],
  controllers: [HomecareController],
  providers: [HomecareService, HomecareRepository, BranchRepository, BusinessErrors, PrismaService],
})
export class HomecareModule {}
