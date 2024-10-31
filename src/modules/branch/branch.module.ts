import { CompanyRoles } from "@modules/company/business/company.roles";
import { CompanyRepository } from "@modules/company/dao/company.repository";
import { Module } from "@nestjs/common";
import { FileStorage } from "@shared/shared/externals/file-storage/file-storage";
import { SupabaseService } from "@shared/shared/externals/file-storage/file-storage.client";
import { BusinessErrors } from "@shared/shared/utils/business-errors";
import { PrismaModule } from "src/database/prisma/prisma.module";
import { PrismaService } from "src/database/prisma/prisma.service";

import { BranchController } from "./branch.controller";
import { BranchService } from "./branch.service";
import { BranchRepository } from "./dao/branch.repository";

@Module({
  imports: [PrismaModule],
  controllers: [BranchController],
  providers: [
    BranchService,
    SupabaseService,
    FileStorage,
    BranchRepository,
    CompanyRepository,
    CompanyRoles,
    BusinessErrors,
    PrismaService,
  ],
})
export class BranchModule {}
