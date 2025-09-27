import { Injectable } from '@nestjs/common';
import { PrismaService } from "src/database/prisma/prisma.service";
import { PatientRelationships } from '@prisma/client';

@Injectable()
export class PatientRelationshipsRepository {
  constructor(private readonly prisma: PrismaService) { }

  async findAll() {
    return this.prisma.patientRelationships.findMany({ include: { patient: true } });
  }
  async findOne(id: string) {
    return this.prisma.patientRelationships.findUnique({ where: { id }, include: { patient: true } });
  }
  async findPatientsByCompanyId(companyId: string) {
    return this.prisma.patientRelationships.findMany({
      where:
        { OR: [{ homecareId: companyId }, { supplierId: companyId }] },
      include: { patient: true },
    });
  }
  async findPatientsByHomecareId(homecareId: string) {
    return this.prisma.patientRelationships.findMany({
      where: { homecareId },
      include: { patient: true },
    })
  }
  async findPatientRelationshipsByCareServiceType(homecareId: string, type: string) {
    return this.prisma.patientRelationships.findMany({
      where: {
        homecareId,
        careServiceTypeNeeds: {
          some: { type }
        }
      }
    });
  }
  async update(id: string, data: Partial<PatientRelationships>, userId: string) {
    return this.prisma.patientRelationships.update({
      where: { id },
      data: { updatedBy: userId, ...data }
    });
  }
  async remove(id: string) {
    return this.prisma.patientRelationships.delete({ where: { id } });
  }
}
