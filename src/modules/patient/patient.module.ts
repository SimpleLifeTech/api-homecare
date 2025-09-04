import { Module } from '@nestjs/common';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { PatientRepository } from './dao/patient.repository';
import { PrismaService } from "src/database/prisma/prisma.service";

@Module({
  controllers: [PatientController],
  providers: [PatientService, PatientRepository, PrismaService],
  exports: [PatientService],
})
export class PatientModule {}
