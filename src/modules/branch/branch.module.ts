import { CompanyRepository } from "@modules/company/dao/company.repository";
import { Module } from "@nestjs/common";
import { BusinessErrors } from "@shared/shared/utils/business-errors";
import { PrismaModule } from "src/database/prisma/prisma.module";
import { PrismaService } from "src/database/prisma/prisma.service";

import { BranchController } from "./branch.controller";
import { BranchService } from "./branch.service";
import { BranchRepository } from "./dao/branch.repository";
import { CompanyRoles } from "@modules/company/business/company.roles";

@Module({
  imports: [PrismaModule],
  controllers: [BranchController],
  providers: [
    BranchService,
    BranchRepository,
    CompanyRepository,
    CompanyRoles,
    BusinessErrors,
    PrismaService,
  ],
})
export class BranchModule {}
