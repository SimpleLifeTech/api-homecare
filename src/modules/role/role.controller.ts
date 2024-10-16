import { Body, Controller, Delete, Get, Param, Post, Put, Res } from "@nestjs/common";
import { GlobalFunctions } from "@shared/shared/utils/functions";
import { Response } from "express";

import { CreateOrUpdateRoleDTO } from "./dto/create-update-role.dto";
import { RoleService } from "./role.service";

const globalFunctions = new GlobalFunctions();

@Controller("role")
export class RoleController {
  constructor(protected readonly roleService: RoleService) {}

  @Post("/create")
  async createRole(@Body() body: CreateOrUpdateRoleDTO, @Res() res: Response) {
    const { codeHttp, ...response } = await this.roleService.createRole(body);
    return res.status(codeHttp).json(response);
  }

  @Get("/list/:roleId")
  async getRoleById(@Param("roleId") roleId: number, @Res() res: Response) {
    globalFunctions.IsEmptyParam(roleId);
    const { codeHttp, ...response } = await this.roleService.findRoleById(roleId);
    return res.status(codeHttp).json(response);
  }

  @Get("/list-all")
  async getRoles(@Res() res: Response) {
    const { codeHttp, ...response } = await this.roleService.findRoles();
    return res.status(codeHttp).json(response);
  }

  @Put("/update/:roleId")
  async updateRole(
    @Param("roleId") roleId: number,
    @Body() body: CreateOrUpdateRoleDTO,
    @Res() res: Response,
  ) {
    globalFunctions.IsEmptyParam(roleId);
    const { codeHttp, ...response } = await this.roleService.updateRoleById(roleId, body);
    return res.status(codeHttp).json(response);
  }

  @Delete("/delete/:roleId")
  async deleteRole(@Param("roleId") roleId: number, @Res() res: Response) {
    globalFunctions.IsEmptyParam(roleId);
    const { codeHttp, ...response } = await this.roleService.inactivateRoleById(roleId);
    return res.status(codeHttp).json(response);
  }
}
