import { HomecareModel } from "@modules/models/homecare.model";
import { DataSource, UpdateResult } from "typeorm";

import { CreateHomecareDTO } from "../dto/create-homecare.dto";
import { UpdateHomecareDTO } from "../dto/update-homecare.dto";

export class HomecareRepository {
  constructor(private dataSource: DataSource) {}
  private readonly repository = this.dataSource.getRepository(HomecareModel);

  async createHomecare(data: CreateHomecareDTO): Promise<HomecareModel> {
    return this.repository.save(data);
  }

  async findHomecareByName(branchId: string, name: string): Promise<HomecareModel> {
    return this.repository.findOneBy({ branch_id: branchId, name });
  }

  async findHomecareByBranchId(branchId: string): Promise<HomecareModel[]> {
    return this.repository.findBy({ branch_id: branchId });
  }

  async findHomecareById(homecareId: string): Promise<HomecareModel> {
    return this.repository.findOneBy({ id: homecareId });
  }

  async updateHomecareById(homecareId: string, data: UpdateHomecareDTO): Promise<UpdateResult> {
    return this.repository.update({ id: homecareId }, data);
  }

  async inactivateHomecareById(homecareId: string): Promise<UpdateResult> {
    return this.repository.softDelete({ id: homecareId });
  }
}
