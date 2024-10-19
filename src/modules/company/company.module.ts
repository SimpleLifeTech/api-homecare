import { Module } from "@nestjs/common";
import { BusinessErrors } from "@shared/shared/utils/business-errors";
import { PrismaModule } from "src/database/prisma/prisma.module";
import { PrismaService } from "src/database/prisma/prisma.service";

import { CompanyController } from "./company.controller";
import { CompanyService } from "./company.service";
import { CompanyRepository } from "./dao/company.repository";

@Module({
  imports: [PrismaModule],
  controllers: [CompanyController],
  providers: [CompanyService, CompanyRepository, BusinessErrors, PrismaService],
})
export class CompanyModule {}
