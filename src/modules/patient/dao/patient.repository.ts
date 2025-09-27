import { Injectable } from "@nestjs/common";
import { Patient } from "@prisma/client";
import { PrismaService } from "src/database/prisma/prisma.service";

import { CreatePatientDto } from "../dto/create-patient.dto";

@Injectable()
export class PatientRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createPatient(
    data: CreatePatientDto,
    personId: string,
    userId: string,
    supplierId: string,
    homecareId: string,
  ) {
    return await this.prisma.$transaction(async (tx) => {
      const patient = await tx.patient.create({
        data: {
          personId: personId,
          responsibleEmail: data.responsibleEmail,
          responsibleName: data.responsibleName,
        },
      });

      tx.patientRelationships.create({
        data: {
          patientId: patient.id,
          supplierId: supplierId,
          homecareId: homecareId,
          requiredCareHours: data.requiredCareHours,
          customFields: data.customFields,
          notations: data.notations,
          allowanceCostOrigin: data.allowanceCostOrigin,
          allowanceCostPrice: data.allowanceCostPrice,
          createdBy: userId,
        },
      });
    });
  }
  async findAll() {
    return this.prisma.patient.findMany({ include: { person: true, relationships: true } });
  }
  async findOne(id: string) {
    return this.prisma.patient.findUnique({
      where: { id },
      include: { person: true, relationships: true },
    });
  }
  async update(id: string, data: Partial<Patient>) {
    return this.prisma.patient.update({ where: { id }, data });
  }
  async remove(id: string) {
    return this.prisma.patient.delete({ where: { id } });
  }
}
