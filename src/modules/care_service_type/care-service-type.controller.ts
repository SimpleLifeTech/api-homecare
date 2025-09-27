import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { GlobalFunctions } from "@shared/shared/utils/functions";

import { CareServiceTypeService } from "./care-service-type.service";
import { CreateOrUpdateCareServiceTypeDTO } from "./dto/create-or-update-care-service-type.dto";

const { IsEmptyParam } = new GlobalFunctions();

@Controller("care-service-type")
export class CareServiceTypeController {
  constructor(private readonly careServiceTypeService: CareServiceTypeService) {}

  @Post("/create")
  async createCareServiceType(@Body() data: CreateOrUpdateCareServiceTypeDTO) {
    //TODO!: PEGAR DO JWT
    const jwt = "";
    const companyId = jwt;
    return await this.careServiceTypeService.createCareServiceType(companyId, data.name);
  }

  @Get("/list/:careServiceTypeId")
  async findCareServiceTypeById(@Param("careServiceTypeId") careServiceTypeId: string) {
    IsEmptyParam(careServiceTypeId);
    return await this.careServiceTypeService.findCareServiceTypeById(careServiceTypeId);
  }

  @Get('/list-by-company')
  async findCareServiceTypesByCompanyId() {
    //TODO!: PEGAR DO JWT
    const jwt = "";
    const companyId = jwt;
    return await this.careServiceTypeService.findCareServiceTypesByCompanyId(companyId);
  }

  @Put("/inactivate/:careServiceTypeId")
  async inactivateCareServiceType(@Param("careServiceTypeId") careServiceTypeId: string) {
    IsEmptyParam(careServiceTypeId);
    return await this.careServiceTypeService.inactivateCareServiceType(careServiceTypeId);
  }

  @Delete("/delete/:careServiceTypeId")
  async delete(@Param("careServiceTypeId") careServiceTypeId: string) {
    IsEmptyParam(careServiceTypeId);
    return await this.careServiceTypeService.inactivateCareServiceType(careServiceTypeId);
  }
}
