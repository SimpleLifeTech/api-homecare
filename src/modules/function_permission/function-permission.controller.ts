import { Body, Controller, Delete, Get, Param, Post, Put, Res } from "@nestjs/common";
import { GlobalFunctions } from "@shared/shared/utils/functions";
import { Response } from "express";

import { CreateFunctionPermissionDTO } from "./dto/create-function-permission.dto";
import { UpdateFunctionPermissionDTO } from "./dto/update-function-permission.dto";
import { FunctionPermissionService } from "./function-permission.service";

@Controller("function-permission")
export class FunctionPermissionController {
  constructor(
    private readonly functionPermissionService: FunctionPermissionService,
    private readonly globalFunctions = new GlobalFunctions(),
  ) {}

  @Post("/create/:functionId")
  async createFunctionPermission(
    @Param("functionId") functionId: number,
    @Body() data: CreateFunctionPermissionDTO,
    @Res() res: Response,
  ) {
    this.globalFunctions.IsEmptyParam(functionId);
    const { codeHttp, ...response } = await this.functionPermissionService.createFunctionPermission(
      Number(functionId),
      data,
    );

    return res.status(codeHttp).json(response);
  }

  @Get("/list/:functionPermissionId")
  async getFunctionPermissionById(
    @Param("functionPermissionId") functionPermissionId: string,
    @Res() res: Response,
  ) {
    this.globalFunctions.IsEmptyParam(functionPermissionId);
    const { codeHttp, ...response } =
      await this.functionPermissionService.findFunctionPermissionById(functionPermissionId);

    return res.status(codeHttp).json(response);
  }

  @Put("/update/:functionPermissionId")
  async updateFunctionPermissionById(
    @Param("functionPermissionId") functionPermissionId: string,
    @Body() data: UpdateFunctionPermissionDTO,
    @Res() res: Response,
  ) {
    this.globalFunctions.IsEmptyParam(functionPermissionId);
    const { codeHttp, ...response } =
      await this.functionPermissionService.updateFunctionPermissionById(functionPermissionId, data);

    return res.status(codeHttp).json(response);
  }

  @Delete("/delete/:functionPermissionId")
  async inactivateFunctionPermissionById(
    @Param("functionPermissionId") functionPermissionId: string,
    @Res() res: Response,
  ) {
    this.globalFunctions.IsEmptyParam(functionPermissionId);
    const { codeHttp, ...response } =
      await this.functionPermissionService.inactivateFunctionPermissionById(functionPermissionId);

    return res.status(codeHttp).json(response);
  }
}
