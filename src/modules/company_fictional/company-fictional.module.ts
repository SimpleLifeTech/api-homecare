import { BranchModule } from "@modules/branch/branch.module";
import { CompanyModule } from "@modules/company/company.module";
import { Module } from "@nestjs/common";
import { CacheRepository } from "@shared/shared/cache/cache.repository";
import { PrismaModule } from "src/database/prisma/prisma.module";
import { PrismaService } from "src/database/prisma/prisma.service";

import { CompanyFictionalController } from "./company-fictional.controller";
import { CompanyFictionalService } from "./company-fictional.service";
import { CompanyFictionalRepository } from "./dao/company-fictional.repository";

@Module({
  imports: [BranchModule, CompanyModule, PrismaModule],
  controllers: [CompanyFictionalController],
  providers: [CompanyFictionalRepository, CacheRepository, CompanyFictionalService, PrismaService],
})
export class CompanyFictionalModule {}
