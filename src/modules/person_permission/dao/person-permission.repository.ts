import { Injectable } from "@nestjs/common";
import { GlobalFunctions } from "@shared/shared/utils/functions";
import { PrismaService } from "src/database/prisma/prisma.service";

const { getCurrentDateAndTime } = new GlobalFunctions();

@Injectable()
export class PersonPermissionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createPersonPermission(
    personId: string,
    rolePermissionId: string,
  ) {
    return await this.prisma.personPermission.create({
      data: { personId: personId, rolePermissionId: rolePermissionId },
    });
  }

  async findPermissionByPersonId(personId: string) {
    return await this.prisma.personPermission.findMany({
      where: { personId: personId, deletedAt: null },
      include: { rolePermission: true },
    });
  }

  async findPermissionById(personPermissionId: string) {
    return await this.prisma.personPermission.findUnique({
      where: { id: personPermissionId, deletedAt: null },
    });
  }

  async updatePermissionById(
    personPermissionId: string,
    rolePermissionId: string,
  ) {
    return await this.prisma.personPermission.update({
      where: { id: personPermissionId },
      data: { rolePermissionId: rolePermissionId },
    });
  }

  async inactivatePermissionById(personPermissionId: string) {
    return await this.prisma.personPermission.update({
      where: { id: personPermissionId },
      data: { deletedAt: getCurrentDateAndTime() },
    });
  }
}
