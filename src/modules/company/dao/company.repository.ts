import { CompanyModel } from "@modules/models/company.model";
import { GlobalFunctions } from "@shared/shared/utils/functions";
import { PrismaService } from "src/database/prisma/prisma.service";

import { CreateCompanyDTO } from "../dto/create-company.dto";
import { UpdateCompanyDTO } from "../dto/update-company.dto";

const globalFunction = new GlobalFunctions();

export class CompanyRepository {
  constructor(private prisma: PrismaService) {}

  async createCompany(personId: string, data: CreateCompanyDTO): Promise<CompanyModel> {
    return await this.prisma.company.create({
      data: {
        person: {
          connect: { id: personId },
        },
        ...data,
      },
    });
  }

  async findCompanyByDocument(document: string): Promise<CompanyModel> {
    return await this.prisma.company.findFirst({ where: { document, deleted_at: null } });
  }

  async findCompanyById(companyId: string): Promise<CompanyModel> {
    return await this.prisma.company.findUnique({ where: { id: companyId, deleted_at: null } });
  }

  async findCompanyByUserId(personId: string): Promise<CompanyModel> {
    return await this.prisma.company.findFirst({
      where: { person_id: personId, deleted_at: null },
    });
  }

  async updateCompanyById(companyId: string, data: UpdateCompanyDTO): Promise<CompanyModel> {
    return await this.prisma.company.update({
      where: { id: companyId },
      data: { ...data },
    });
  }

  async inactivateCompanyById(companyId: string): Promise<CompanyModel> {
    return await this.prisma.company.update({
      where: { id: companyId },
      data: { deleted_at: globalFunction.getCurrentDateAndTime() },
    });
  }
}
