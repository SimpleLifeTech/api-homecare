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

  async findHomecareByName(companyId: string, name: string): Promise<HomecareModel> {
    return this.repository.findOne({ where: { company_id: companyId, name } });
  }

  async findHomecareByCompanyId(companyId: string): Promise<HomecareModel[]> {
    return this.repository.findBy({ company_id: companyId });
  }

  async findHomecareById(homecareId: string): Promise<HomecareModel> {
    return this.repository.findOne({ where: { id: homecareId } });
  }

  async updateHomecareById(homecareId: string, data: UpdateHomecareDTO): Promise<UpdateResult> {
    return this.repository.update({ id: homecareId }, data);
  }

  async inactivateHomecareById(homecareId: string): Promise<UpdateResult> {
    return this.repository.softDelete({ id: homecareId });
  }
}
