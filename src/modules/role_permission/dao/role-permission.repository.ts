import { RolePermissionModel } from "@modules/models/role-permission.model";
import { Injectable } from "@nestjs/common";
import { GlobalFunctions } from "@shared/shared/utils/functions";
import { PrismaService } from "src/database/prisma/prisma.service";

import { CreateRolePermissionDTO } from "../dto/create-role-permission.dto";
import { UpdateRolePermissionDTO } from "../dto/update-role-permission.dto";

const globalFunction = new GlobalFunctions();

@Injectable()
export class RolePermissionRepository {
  constructor(private prisma: PrismaService) {}

  async createRolePermission(
    roleId: number,
    data: CreateRolePermissionDTO,
  ): Promise<RolePermissionModel> {
    return await this.prisma.rolePermission.create({
      data: {
        feed: data.feed,
        delete: data.delete,
        roleId: roleId,
      },
    });
  }

  async findRolePermissionById(rolePermissionId: string): Promise<RolePermissionModel> {
    return await this.prisma.rolePermission.findUnique({
      where: { id: rolePermissionId, deletedAt: null },
    });
  }

  async findRolePermissionByRoleId(roleId: number): Promise<RolePermissionModel> {
    return await this.prisma.rolePermission.findFirst({
      where: { roleId: roleId, deletedAt: null },
    });
  }

  async updateRolePermissionById(
    rolePermissionId: string,
    data: UpdateRolePermissionDTO,
  ): Promise<RolePermissionModel> {
    return await this.prisma.rolePermission.update({
      where: { id: rolePermissionId },
      data: { ...data },
    });
  }

  async inactivateRolePermissionById(rolePermissionId: string): Promise<RolePermissionModel> {
    return await this.prisma.rolePermission.update({
      where: { id: rolePermissionId },
      data: { deletedAt: globalFunction.getCurrentDateAndTime() },
    });
  }
}
