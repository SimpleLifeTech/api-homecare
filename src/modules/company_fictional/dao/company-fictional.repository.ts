import { Injectable } from "@nestjs/common";
import { CompanyType } from "@prisma/client";
import { GlobalFunctions } from "@shared/shared/utils/functions";
import { PrismaService } from "src/database/prisma/prisma.service";

import { CreateCompanyFictionalDTO } from "../dto/create-company-fictional.dto";
import { UpdateCompanyFictionalDTO } from "../dto/update-company-fictional.dto";

const { getCurrentDateAndTime, removeSpecialCharacters } = new GlobalFunctions();

@Injectable()
export class CompanyFictionalRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createCompanyFictional(data: CreateCompanyFictionalDTO, companyIdWhoCreates: string) {
    return await this.prisma.$transaction(async (tx) => {
      const companyFictional = await tx.companyFictional.create({ data });

      if (data.type === CompanyType.HOMECARE) {
        await tx.companyRelationships.create({
          data: {
            homecareFictionalId: companyFictional.id,
            supplierId: companyIdWhoCreates,
            createdBy: data.personId,
          },
        });
      } else {
        await tx.companyRelationships.create({
          data: {
            homecareId: companyIdWhoCreates,
            supplierFictionalId: companyFictional.id,
            createdBy: data.personId,
          },
        });
      }
    });
  }

  async findCompanyFictionalById(id: string) {
    return await this.prisma.companyFictional.findUnique({
      where: { id, deletedAt: null },
    });
  }

  async findCompanyFictionalByBranchId(branchId: string) {
    return await this.prisma.companyFictional.findMany({
      where: { branchId, deletedAt: null },
    });
  }

  async findCompanyFictionalByName(name: string, branchId: string) {
    return await this.prisma.companyFictional.findFirst({
      where: { name: { contains: name, mode: "insensitive" }, branchId, deletedAt: null },
    });
  }

  async updateCompanyFictional(id: string, data: UpdateCompanyFictionalDTO) {
    return await this.prisma.companyFictional.update({
      where: { id, deletedAt: null },
      data,
    });
  }

  async inactivateCompanyFictional(id: string) {
    return await this.prisma.companyFictional.update({
      where: { id, deletedAt: null },
      data: { deletedAt: getCurrentDateAndTime() },
    });
  }
}
