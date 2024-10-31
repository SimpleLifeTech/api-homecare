import { PersonRoles } from "@modules/person/business/person.roles";
import { PersonRepository } from "@modules/person/dao/person.repository";
import { Module } from "@nestjs/common";
import { FileStorage } from "@shared/shared/externals/file-storage/file-storage";
import { SupabaseService } from "@shared/shared/externals/file-storage/file-storage.client";
import { BusinessErrors } from "@shared/shared/utils/business-errors";
import { PrismaModule } from "src/database/prisma/prisma.module";
import { PrismaService } from "src/database/prisma/prisma.service";

import { CompanyController } from "./company.controller";
import { CompanyService } from "./company.service";
import { CompanyRepository } from "./dao/company.repository";
import { BrazilAPI } from "@shared/shared/externals/brazil-api/brazil.apis";

@Module({
  imports: [PrismaModule],
  controllers: [CompanyController],
  providers: [
    CompanyService,
    CompanyRepository,
    SupabaseService,
    FileStorage,
    BrazilAPI,
    PersonRepository,
    PersonRoles,
    BusinessErrors,
    PrismaService,
  ],
})
export class CompanyModule {}
