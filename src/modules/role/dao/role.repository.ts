import { Injectable } from "@nestjs/common";
import { GlobalFunctions } from "@shared/shared/utils/functions";
import { PrismaService } from "src/database/prisma/prisma.service";

import { CreateOrUpdateRoleDTO } from "../dto/create-update-role.dto";

const { getCurrentDateAndTime } = new GlobalFunctions();

@Injectable()
export class RoleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createRole(data: CreateOrUpdateRoleDTO) {
    return await this.prisma.role.create({ data: { ...data } });
  }

  async findRoleByName(name: string) {
    return await this.prisma.role.findFirst({ where: { name, deletedAt: null } });
  }

  async findRoleById(roleId: number) {
    return await this.prisma.role.findUnique({ where: { id: roleId, deletedAt: null } });
  }

  async findRoles() {
    return await this.prisma.role.findMany({ where: { deletedAt: null } });
  }

  async updateRoleById(roleId: number, data: CreateOrUpdateRoleDTO) {
    return await this.prisma.role.update({ where: { id: roleId }, data: { ...data } });
  }

  async inactivateRoleById(roleId: number) {
    return await this.prisma.role.update({
      where: { id: roleId },
      data: { deletedAt: getCurrentDateAndTime() },
    });
  }
}
