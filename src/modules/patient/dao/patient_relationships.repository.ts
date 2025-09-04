import { Injectable } from '@nestjs/common';
import { PrismaService } from "src/database/prisma/prisma.service";
import { PatientRelationships } from '@prisma/client';

@Injectable()
export class PatientRelationshipsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.patient.findMany({ include: { person: true, relationships: true } });
  }
  async findOne(id: string) {
    return this.prisma.patient.findUnique({ where: { id }, include: { person: true, relationships: true } });
  }
  async update(id: string, data: Partial<PatientRelationships>, userId: string) {
    return this.prisma.patient.update({
      where: { id },
      data: { updatedBy: userId, ...data }
    });
  }
  async remove(id: string) {
    return this.prisma.patient.delete({ where: { id } });
  }
}
