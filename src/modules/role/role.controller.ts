import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { GlobalFunctions } from "@shared/shared/utils/functions";

import { CreateOrUpdateRoleDTO } from "./dto/create-update-role.dto";
import { RoleService } from "./role.service";

const { IsEmptyParam } = new GlobalFunctions();

@Controller("role")
export class RoleController {
  constructor(protected readonly roleService: RoleService) {}

  @Post("/create")
  async createRole(@Body() body: CreateOrUpdateRoleDTO) {
    return this.roleService.createRole(body);
  }

  @Get("/list/:roleId")
  async getRoleById(@Param("roleId") roleId: number) {
    IsEmptyParam(roleId);
    return this.roleService.findRoleById(roleId);
  }

  @Get("/list-all")
  async getRoles() {
    return this.roleService.findRoles();
  }

  @Put("/update/:roleId")
  async updateRole(@Param("roleId") roleId: number, @Body() body: CreateOrUpdateRoleDTO) {
    IsEmptyParam(roleId);
    return this.roleService.updateRoleById(roleId, body);
  }

  @Delete("/delete/:roleId")
  async deleteRole(@Param("roleId") roleId: number) {
    IsEmptyParam(roleId);
    return this.roleService.inactivateRoleById(roleId);
  }
}
