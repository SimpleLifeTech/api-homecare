import { CompanyModel } from "@modules/models/company.model";
import { DataSource, UpdateResult } from "typeorm";

import { CreateCompanyDTO } from "../dto/create-company.dto";
import { UpdateCompanyDTO } from "../dto/update-company.dto";

export class CompanyRepository {
  constructor(private dataSource: DataSource) {}
  private readonly repository = this.dataSource.getRepository(CompanyModel);

  async createCompany(data: CreateCompanyDTO): Promise<CompanyModel> {
    return this.repository.save(data);
  }

  async findCompanyByDocument(document: string): Promise<CompanyModel> {
    return this.repository.findOne({ where: { document } });
  }

  async findCompanyById(companyId: string): Promise<CompanyModel> {
    return this.repository.findOne({ where: { id: companyId } });
  }

  async updateCompanyById(companyId: string, data: UpdateCompanyDTO): Promise<UpdateResult> {
    return this.repository.update({ id: companyId }, data);
  }

  async inactivateCompanyById(companyId: string): Promise<UpdateResult> {
    return this.repository.softDelete({ id: companyId });
  }
}
