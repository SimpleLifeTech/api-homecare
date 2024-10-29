import { PersonPermissionModel } from "@modules/models/person-permission.model";
import { Injectable } from "@nestjs/common";
import { GlobalFunctions } from "@shared/shared/utils/functions";
import { PrismaService } from "src/database/prisma/prisma.service";

const globalFunction = new GlobalFunctions();

@Injectable()
export class PersonPermissionRepository {
  constructor(private prisma: PrismaService) {}

  async createPersonPermission(
    personId: string,
    rolePermissionId: string,
  ): Promise<PersonPermissionModel> {
    return await this.prisma.person_permission.create({
      data: { person_id: personId, role_permission_id: rolePermissionId },
    });
  }

  async findPermissionByPersonId(personId: string): Promise<PersonPermissionModel[]> {
    return await this.prisma.person_permission.findMany({
      where: { person_id: personId, deleted_at: null },
      include: { role_permission: true },
    });
  }

  async findPermissionById(personPermissionId: string): Promise<PersonPermissionModel> {
    return await this.prisma.person_permission.findUnique({
      where: { id: personPermissionId, deleted_at: null },
    });
  }

  async updatePermissionById(
    personPermissionId: string,
    rolePermissionId: string,
  ): Promise<PersonPermissionModel> {
    return await this.prisma.person_permission.update({
      where: { id: personPermissionId },
      data: { role_permission_id: rolePermissionId },
    });
  }

  async inactivatePermissionById(personPermissionId: string): Promise<PersonPermissionModel> {
    return await this.prisma.person_permission.update({
      where: { id: personPermissionId },
      data: { deleted_at: globalFunction.getCurrentDateAndTime() },
    });
  }
}
