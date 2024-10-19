import { BranchRoles } from "@modules/branch/business/branch.roles";
import { BranchRepository } from "@modules/branch/dao/branch.repository";
import { HomecareModel } from "@modules/models/homecare.model";
import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { APIResponse, CoreResponse, ErrorTypes } from "@shared/shared/utils/response";

import { HomecareRoles } from "./business/homecare.roles";
import { HomecareRepository } from "./dao/homecare.repository";
import { CreateHomecareDTO } from "./dto/create-homecare.dto";
import { UpdateHomecareDTO } from "./dto/update-homecare.dto";

const response = new CoreResponse();

@Injectable()
export class HomecareService extends HomecareRoles {
  constructor(
    @Inject(HomecareRepository)
    protected readonly homecareRepository: HomecareRepository,
    @Inject(BranchRepository)
    protected readonly branchRepository: BranchRepository,
    protected readonly branchRoles: BranchRoles,
  ) {
    super();
  }

  async createHomecare(
    branchId: string,
    createHomecareDTO: CreateHomecareDTO,
  ): Promise<APIResponse<string, ErrorTypes>> {
    const branchExists = await this.branchRepository.findBranchById(branchId);

    await this.branchRoles.branchNotFound(branchExists);

    const homecareExists = await this.homecareRepository.findHomecareByName(
      branchId,
      createHomecareDTO.name,
    );

    await this.homecareNotFound(homecareExists);

    await this.homecareRepository.createHomecare(branchId, createHomecareDTO);

    return response.success("Homecare criado com sucesso!", HttpStatus.CREATED);
  }

  async findHomecareById(homecareId: string): Promise<APIResponse<HomecareModel, ErrorTypes>> {
    const homecare = await this.homecareRepository.findHomecareById(homecareId);

    await this.homecareNotFound(homecare);

    return response.success(homecare);
  }

  async findHomecaresByBranchId(
    branchId: string,
  ): Promise<APIResponse<HomecareModel[], ErrorTypes>> {
    const branch = await this.branchRepository.findBranchById(branchId);

    await this.branchRoles.branchNotFound(branch);

    const homecares = await this.homecareRepository.findHomecaresByBranchId(branchId);

    return response.success(homecares);
  }

  async updateHomecare(
    homecareId: string,
    payload: UpdateHomecareDTO,
  ): Promise<APIResponse<string, ErrorTypes>> {
    const homecare = await this.homecareRepository.findHomecareById(homecareId);

    await this.homecareNotFound(homecare);

    await this.homecareRepository.updateHomecareById(homecareId, payload);

    return response.success("Homecare atualizado com sucesso!");
  }

  async inactivateHomecare(homcareId: string): Promise<APIResponse<string, ErrorTypes>> {
    const homecare = await this.homecareRepository.findHomecareById(homcareId);

    await this.homecareNotFound(homecare);

    await this.homecareRepository.inactivateHomecareById(homcareId);

    return response.success("Homecare deletado com sucesso!");
  }
}
