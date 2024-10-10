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

  @Post("/create/:companyId")
  async createHomecare(
    @Param() companyId: string,
    @Body() body: CreateHomecareDTO,
    @Res() res: Response,
  ) {
    const { codeHttp, ...response } = await this.homecareService.createHomecare(companyId, body);

    return res.status(codeHttp).json(response);
  }

  @Get("/list/:homecareId")
  async getHomecareById(@Param("homecareId") homecareId: string, @Res() res: Response) {
    this.globalFunctions.IsEmptyParam(homecareId);

    const { codeHttp, ...response } = await this.homecareService.findHomecareById(homecareId);

    return res.status(codeHttp).json(response);
  }

  @Get("/list-all/:companyId")
  async getHomecare(@Param("companyId") companyId: string, @Res() res: Response) {
    this.globalFunctions.IsEmptyParam(companyId);

    const { codeHttp, ...response } = await this.homecareService.findHomecare(companyId);

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
