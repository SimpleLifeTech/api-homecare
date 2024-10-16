import { Module } from "@nestjs/common";
import { BusinessErrors } from "@shared/shared/utils/business-errors";
import { PrismaModule } from "src/database/prisma/prisma.module";
import { PrismaService } from "src/database/prisma/prisma.service";

import { PersonRepository } from "./dao/person.repository";
import { PersonController } from "./person.controller";
import { PersonService } from "./person.service";

@Module({
  imports: [PrismaModule],
  controllers: [PersonController],
  providers: [PersonService, PersonRepository, BusinessErrors, PrismaService],
})
export class PersonModule {}
