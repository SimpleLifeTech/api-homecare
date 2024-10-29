import { Body, Controller, Delete, Get, Param, Post, Put, Res } from "@nestjs/common";
import { GlobalFunctions } from "@shared/shared/utils/functions";
import { Response } from "express";

import { CreateHomecareDTO } from "./dto/create-homecare.dto";
import { UpdateHomecareDTO } from "./dto/update-homecare.dto";
import { HomecareService } from "./homecare.service";

const globalFunctions = new GlobalFunctions();

@Controller("homecare")
export class HomecareController {
  constructor(private readonly homecareService: HomecareService) {}

  @Post("/create/:branchId")
  async createHomecare(
    @Param() branchId: string,
    @Body() body: CreateHomecareDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { codeHttp, ...response } = await this.homecareService.createHomecare(branchId, body);

    res.status(codeHttp).json(response);
  }

  @Get("/list/:homecareId")
  async getHomecareById(
    @Param("homecareId") homecareId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    globalFunctions.IsEmptyParam(homecareId);

    const { codeHttp, ...response } = await this.homecareService.findHomecareById(homecareId);

    res.status(codeHttp).json(response);
  }

  @Get("/list-all/:branchId")
  async getHomecare(
    @Param("branchId") branchId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    globalFunctions.IsEmptyParam(branchId);

    const { codeHttp, ...response } = await this.homecareService.findHomecaresByBranchId(branchId);

    res.status(codeHttp).json(response);
  }

  @Put("/update/:homecareId")
  async updateHomecare(
    @Param("homecareId") homecareId: string,
    @Body() body: UpdateHomecareDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    globalFunctions.IsEmptyParam(homecareId);

    const { codeHttp, ...response } = await this.homecareService.updateHomecare(homecareId, body);

    res.status(codeHttp).json(response);
  }

  @Delete("/delete/:homecareId")
  async inactivateHomecare(
    @Param("homecareId") homecareId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    globalFunctions.IsEmptyParam(homecareId);

    const { codeHttp, ...response } = await this.homecareService.inactivateHomecare(homecareId);

    res.status(codeHttp).json(response);
  }
}
