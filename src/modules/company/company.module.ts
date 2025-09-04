import { PersonRepository } from "@modules/person/dao/person.repository";
import { Module } from "@nestjs/common";
import { FileStorage } from "@shared/shared/externals/file-storage/file-storage";
import { StorageService } from "@shared/shared/externals/file-storage/file-storage.client";
import { PrismaModule } from "src/database/prisma/prisma.module";
import { PrismaService } from "src/database/prisma/prisma.service";

import { CompanyController } from "./company.controller";
import { CompanyService } from "./company.service";
import { CompanyRepository } from "./dao/company.repository";

@Module({
  imports: [PrismaModule],
  controllers: [CompanyController],
  providers: [
    CompanyService,
    CompanyRepository,
    StorageService,
    FileStorage,
    PersonRepository,
    PrismaService,
  ],
})
export class CompanyModule {}
