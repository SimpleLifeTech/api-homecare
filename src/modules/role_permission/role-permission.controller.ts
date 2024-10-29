import { Body, Controller, Delete, Get, Param, Post, Put, Res } from "@nestjs/common";
import { RolePermissionService } from "./role-permission.service";
import { CreateRolePermissionDTO } from "./dto/create-role-permission.dto";
import { Response } from "express";
import { GlobalFunctions } from "@shared/shared/utils/functions";
import { UpdateRolePermissionDTO } from "./dto/update-role-permission.dto";

const globalFunctions = new GlobalFunctions();

@Controller("role-permission")
export class RolePermissionController {
  constructor(protected readonly rolePermissionService: RolePermissionService) {}

  @Post("role-permission/create/:roleId")
  async createRolePermission(
    @Param("roleId") roleId: string,
    @Body() data: CreateRolePermissionDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    globalFunctions.IsEmptyParam(roleId);
    const { codeHttp, ...response } = await this.rolePermissionService.createRolePermission(
      Number(roleId),
      data,
    );
    res.status(codeHttp).json(response);
  }

  @Get("role-permission/list/:rolePermissionId")
  async getRolePermissionById(
    @Param("rolePermissionId") rolePermissionId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    globalFunctions.IsEmptyParam(rolePermissionId);

    const { codeHttp, ...response } =
      await this.rolePermissionService.findRolePermissionById(rolePermissionId);

    res.status(codeHttp).json(response);
  }

  @Put("role-permission/update/:rolePermissionId")
  async updateRolePermissionById(
    @Param("rolePermissionId") rolePermissionId: string,
    @Body() data: UpdateRolePermissionDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    globalFunctions.IsEmptyParam(rolePermissionId);

    const { codeHttp, ...response } = await this.rolePermissionService.updateFunctionPermissionById(
      rolePermissionId,
      data,
    );

    res.status(codeHttp).json(response);
  }

  @Delete("role-permission/delete/:rolePermissionId")
  async deleteRolePermissionById(
    @Param("rolePermissionId") rolePermissionId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    globalFunctions.IsEmptyParam(rolePermissionId);

    const { codeHttp, ...response } =
      await this.rolePermissionService.inactivateFunctionPermissionById(rolePermissionId);

    res.status(codeHttp).json(response);
  }
}
