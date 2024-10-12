import { Body, Controller, Delete, Get, Param, Post, Put, Res } from "@nestjs/common";
import { Response } from "express";

import { CreateOrUpdateFunctionDTO } from "./dto/create-update-function.dto";
import { FunctionService } from "./function.service";

@Controller("function")
export class FunctionController {
  constructor(protected readonly functionService: FunctionService) {}

  @Post("/create")
  async createFunction(@Body() body: CreateOrUpdateFunctionDTO, @Res() res: Response) {
    const { codeHttp, ...response } = await this.functionService.createFunction(body);
    return res.status(codeHttp).json(response);
  }

  @Get("/list/:functionId")
  async getFunctionById(@Param("functionId") functionId: number, @Res() res: Response) {
    const { codeHttp, ...response } = await this.functionService.findFunctionById(functionId);
    return res.status(codeHttp).json(response);
  }

  @Get("/list-all")
  async getFunctions(@Res() res: Response) {
    const { codeHttp, ...response } = await this.functionService.findFunctions();
    return res.status(codeHttp).json(response);
  }

  @Put("/update/:functionId")
  async updateFunction(
    @Param("functionId") functionId: number,
    @Body() body: CreateOrUpdateFunctionDTO,
    @Res() res: Response,
  ) {
    const { codeHttp, ...response } = await this.functionService.updateFunctionById(
      functionId,
      body,
    );
    return res.status(codeHttp).json(response);
  }

  @Delete("/delete/:functionId")
  async deleteFunction(@Param("functionId") functionId: number, @Res() res: Response) {
    const { codeHttp, ...response } = await this.functionService.inactivateFunctionById(functionId);
    return res.status(codeHttp).json(response);
  }
}
