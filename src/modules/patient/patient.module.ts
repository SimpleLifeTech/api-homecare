import { Module } from '@nestjs/common';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { PatientRepository } from './dao/patient.repository';
import { PatientRelationshipsRepository } from './dao/patient_relationships.repository';
import { PrismaService } from "src/database/prisma/prisma.service";

@Module({
  controllers: [PatientController],
  providers: [PatientService, PatientRepository, PatientRelationshipsRepository, PrismaService],
  exports: [PatientService],
})
export class PatientModule {}
