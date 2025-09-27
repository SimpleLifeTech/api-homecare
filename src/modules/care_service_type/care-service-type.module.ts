import { CompanyModule } from "@modules/company/company.module";
import { Module } from "@nestjs/common";
import { CacheRepository } from "@shared/shared/cache/cache.repository";
import { PrismaModule } from "src/database/prisma/prisma.module";
import { PrismaService } from "src/database/prisma/prisma.service";

import { CareServiceTypeController } from "./care-service-type.controller";
import { CareServiceTypeService } from "./care-service-type.service";
import { CareServiceTypeRepository } from "./dao/care-service-type.repository";

@Module({
  imports: [CompanyModule, PrismaModule],
  controllers: [CareServiceTypeController],
  providers: [CareServiceTypeRepository, CacheRepository, CareServiceTypeService, PrismaService],
  exports: [CareServiceTypeRepository, CareServiceTypeService],
})
export class CareServiceTypeModule {}
