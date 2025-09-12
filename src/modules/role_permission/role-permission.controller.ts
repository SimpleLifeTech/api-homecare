import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { GlobalFunctions } from "@shared/shared/utils/functions";

import { CreateRolePermissionDTO } from "./dto/create-role-permission.dto";
import { UpdateRolePermissionDTO } from "./dto/update-role-permission.dto";
import { RolePermissionService } from "./role-permission.service";

const { IsEmptyParam } = new GlobalFunctions();

@Controller("role-permission")
export class RolePermissionController {
  constructor(protected readonly rolePermissionService: RolePermissionService) {}

  @Post("role-permission/create/:roleId")
  async createRolePermission(
    @Param("roleId") roleId: string,
    @Body() data: CreateRolePermissionDTO,
  ) {
    IsEmptyParam(roleId);
    return this.rolePermissionService.createRolePermission(Number(roleId), data);
  }

  @Get("role-permission/list/:rolePermissionId")
  async getRolePermissionById(@Param("rolePermissionId") rolePermissionId: string) {
    IsEmptyParam(rolePermissionId);
    return this.rolePermissionService.findRolePermissionById(rolePermissionId);
  }

  @Put("role-permission/update/:rolePermissionId")
  async updateRolePermissionById(
    @Param("rolePermissionId") rolePermissionId: string,
    @Body() data: UpdateRolePermissionDTO,
  ) {
    IsEmptyParam(rolePermissionId);
    return this.rolePermissionService.updateFunctionPermissionById(rolePermissionId, data);
  }

  @Delete("role-permission/delete/:rolePermissionId")
  async deleteRolePermissionById(@Param("rolePermissionId") rolePermissionId: string) {
    IsEmptyParam(rolePermissionId);
    return this.rolePermissionService.inactivateFunctionPermissionById(rolePermissionId);
  }
}
