import { Injectable } from "@nestjs/common";
import { GlobalFunctions } from "@shared/shared/utils/functions";
import { PrismaService } from "src/database/prisma/prisma.service";

const { getCurrentDateAndTime } = new GlobalFunctions();

@Injectable()
export class PatientServiceNeedsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createPatientServiceNeeds(data: any) {
    return await this.prisma.patientServiceNeeds.create({ data });
  }

  async createManyPatientServiceNeeds(data: any) {
    return await this.prisma.patientServiceNeeds.createMany({ data });
  }

  async findPatientServiceNeedsByPatientId(patientRelationshipId: string) {
    return await this.prisma.patientServiceNeeds.findMany({
      where: { patientRelationshipId, deletedAt: null },
    });
  }

  async inactivatePatientServiceNeedsById(id: string) {
    return await this.prisma.patientServiceNeeds.update({
      where: { id, deletedAt: null },
      data: { deletedAt: getCurrentDateAndTime() },
    });
  }

  async inactivatePatientServiceNeedsByIds(ids: string[]) {
    return await this.prisma.patientServiceNeeds.updateMany({
      where: { id: { in: ids }, deletedAt: null },
      data: { deletedAt: getCurrentDateAndTime() },
    });
  }

  async inactivateManyPatientServiceNeedsByPatientId(patientRelationshipId: string[]) {
    return await this.prisma.patientServiceNeeds.updateMany({
      where: { patientRelationshipId: { in: patientRelationshipId }, deletedAt: null },
      data: { deletedAt: getCurrentDateAndTime() },
    });
  }
}
