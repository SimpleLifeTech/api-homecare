import { CompanyRoles } from "@modules/company/business/company.roles";
import { CompanyRepository } from "@modules/company/dao/company.repository";
import { HomecareModel } from "@modules/models/homecare.model";
import { HttpStatus } from "@nestjs/common";
import { APIResponse, CoreResponse, ErrorTypes } from "@shared/shared/utils/response";

import { HomecareRoles } from "./business/homecare.roles";
import { HomecareRepository } from "./dao/homecare.repository";
import { CreateHomecareDTO } from "./dto/create-homecare.dto";
import { UpdateHomecareDTO } from "./dto/update-homecare.dto";

export class HomecareService extends HomecareRoles {
  constructor(
    protected readonly homecareRepository: HomecareRepository,
    protected readonly companyRepository: CompanyRepository,
    protected readonly companyRoles: CompanyRoles,
    protected readonly response = new CoreResponse(),
  ) {
    super();
  }

  async createHomecare(
    companyId: string,
    createHomecareDTO: CreateHomecareDTO,
  ): Promise<APIResponse<string, ErrorTypes>> {
    const companyExists = await this.companyRepository.findCompanyById(companyId);

    await this.companyRoles.companyNotFound(companyExists);

    const homecareExists = await this.homecareRepository.findHomecareByName(
      companyId,
      createHomecareDTO.name,
    );

    await this.homecareNotFound(homecareExists);

    await this.homecareRepository.createHomecare(createHomecareDTO);

    return this.response.success("Homecare criado com sucesso!", HttpStatus.CREATED);
  }

  async findHomecareById(homecareId: string): Promise<APIResponse<HomecareModel, ErrorTypes>> {
    const homecare = await this.homecareRepository.findHomecareById(homecareId);

    await this.homecareNotFound(homecare);

    return this.response.success(homecare);
  }

  async findHomecare(companyId: string): Promise<APIResponse<HomecareModel[], ErrorTypes>> {
    const company = await this.companyRepository.findCompanyById(companyId);

    await this.companyRoles.companyNotFound(company);

    const homecares = await this.homecareRepository.findHomecareByCompanyId(companyId);

    return this.response.success(homecares);
  }

  async updateHomecare(
    homecareId: string,
    payload: UpdateHomecareDTO,
  ): Promise<APIResponse<string, ErrorTypes>> {
    const homecare = await this.homecareRepository.findHomecareById(homecareId);

    await this.homecareNotFound(homecare);

    await this.homecareRepository.updateHomecareById(homecareId, payload);

    return this.response.success("Homecare atualizado com sucesso!");
  }

  async inactivateHomecare(homcareId: string): Promise<APIResponse<string, ErrorTypes>> {
    const homecare = await this.homecareRepository.findHomecareById(homcareId);

    await this.homecareNotFound(homecare);

    await this.homecareRepository.inactivateHomecareById(homcareId);

    return this.response.success("Homecare deletado com sucesso!");
  }
}
