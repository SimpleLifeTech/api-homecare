import { CompanyModel } from "@modules/models/company.model";
import { Injectable } from "@nestjs/common";
import { FileStorage } from "@shared/shared/externals/file-storage/file-storage";
import { GlobalFunctions } from "@shared/shared/utils/functions";
import { PrismaService } from "src/database/prisma/prisma.service";

import { CreateCompanyDTO } from "../dto/create-company.dto";
import { UpdateCompanyDTO } from "../dto/update-company.dto";
import { OriginBucket } from "@shared/shared/externals/file-storage/filte-storage.types";

const globalFunction = new GlobalFunctions();

@Injectable()
export class CompanyRepository {
  constructor(
    private prisma: PrismaService,
    private fileStorage: FileStorage,
  ) {}

  async createCompanyAndBranch(
    personId: string,
    data: CreateCompanyDTO,
    file: Express.Multer.File,
  ): Promise<void> {
    return await this.prisma.$transaction(async (tx) => {
      const image = await this.fileStorage.uploadImage(data.document, OriginBucket.COMPANY, file);

      const company = await tx.company.create({
        data: {
          personId: personId,
          name: data.name,
          image,
          document: data.document,
        },
      });

      await tx.branch.create({
        data: {
          companyId: company.id,
          name: data.name,
          address: data.address,
          addressNumber: data.addressNumber,
          addressComplement: data.addressComplement ? data.addressComplement : null,
          addressCity: data.addressCity,
          addressState: data.addressState,
          addressZipcode: data.addressZipcode,
        },
      });

      await tx.person.update({
        where: { id: personId },
        data: { isFirstAccess: false },
      });
    });
  }

  async findCompanyByDocument(document: string): Promise<CompanyModel> {
    return await this.prisma.company.findFirst({ where: { document, deletedAt: null } });
  }

  async findCompanyById(companyId: string): Promise<CompanyModel> {
    return await this.prisma.company.findUnique({ where: { id: companyId, deletedAt: null } });
  }

  async findCompanyByUserId(personId: string): Promise<CompanyModel> {
    return await this.prisma.company.findFirst({
      where: { personId: personId, deletedAt: null },
    });
  }

  async updateCompanyById(
    companyId: string,
    data: UpdateCompanyDTO,
    file: Express.Multer.File,
  ): Promise<CompanyModel> {
    return await this.prisma.$transaction(async (tx) => {
      const image = await this.fileStorage.uploadImage(companyId, OriginBucket.COMPANY, file);

      return await tx.company.update({
        where: { id: companyId },
        data: { ...data, image },
      });
    });
  }

  async inactivateCompanyById(companyId: string): Promise<CompanyModel> {
    return await this.prisma.company.update({
      where: { id: companyId },
      data: { deletedAt: globalFunction.getCurrentDateAndTime() },
    });
  }
}
