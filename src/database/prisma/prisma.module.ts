import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { PersonService } from "@modules/person/person.service";
import { PersonRepository } from "@modules/person/dao/person.repository";

@Module({
  providers: [PrismaService, { provide: PersonService, useValue: PersonRepository }],
  exports: [PrismaService],
})
export class PrismaModule {}
