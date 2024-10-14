import { Body, Controller, Delete, Get, Param, Post, Put, Res } from "@nestjs/common";
import { GlobalFunctions } from "@shared/shared/utils/functions";
import { Response } from "express";

import { CreateHomecareDTO } from "./dto/create-homecare.dto";
import { UpdateHomecareDTO } from "./dto/update-homecare.dto";
import { HomecareService } from "./homecare.service";

@Controller("homecare")
export class HomecareController {
  constructor(
    private readonly homecareService: HomecareService,
    private readonly globalFunctions = new GlobalFunctions(),
  ) {}

  @Post("/create/:branchId")
  async createHomecare(
    @Param() branchId: string,
    @Body() body: CreateHomecareDTO,
    @Res() res: Response,
  ) {
    const { codeHttp, ...response } = await this.homecareService.createHomecare(branchId, body);

    return res.status(codeHttp).json(response);
  }

  @Get("/list/:homecareId")
  async getHomecareById(@Param("homecareId") homecareId: string, @Res() res: Response) {
    this.globalFunctions.IsEmptyParam(homecareId);

    const { codeHttp, ...response } = await this.homecareService.findHomecareById(homecareId);

    return res.status(codeHttp).json(response);
  }

  @Get("/list-all/:branchId")
  async getHomecare(@Param("branchId") branchId: string, @Res() res: Response) {
    this.globalFunctions.IsEmptyParam(branchId);

    const { codeHttp, ...response } = await this.homecareService.findHomecare(branchId);

    return res.status(codeHttp).json(response);
  }

  @Put("/update/:homecareId")
  async updateHomecare(
    @Param("homecareId") homecareId: string,
    @Body() body: UpdateHomecareDTO,
    @Res() res: Response,
  ) {
    this.globalFunctions.IsEmptyParam(homecareId);

    const { codeHttp, ...response } = await this.homecareService.updateHomecare(homecareId, body);

    return res.status(codeHttp).json(response);
  }

  @Delete("/delete/:homecareId")
  async inactivateHomecare(@Param("homecareId") homecareId: string, @Res() res: Response) {
    this.globalFunctions.IsEmptyParam(homecareId);

    const { codeHttp, ...response } = await this.homecareService.inactivateHomecare(homecareId);

    return res.status(codeHttp).json(response);
  }
}
