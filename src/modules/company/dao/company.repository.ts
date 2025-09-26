import { Injectable } from "@nestjs/common";
import { FileStorage } from "@shared/shared/externals/file-storage/file-storage";
import { Buckets } from "@shared/shared/externals/file-storage/filte-storage.types";
import { GlobalFunctions } from "@shared/shared/utils/functions";
import { PrismaService } from "src/database/prisma/prisma.service";

import { CreateCompanyDTO } from "../dto/create-company.dto";
import { UpdateCompanyDTO } from "../dto/update-company.dto";

const { getCurrentDateAndTime, removeSpecialCharacters } = new GlobalFunctions();

@Injectable()
export class CompanyRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileStorage: FileStorage,
  ) {}

  async createCompanyAndBranch(
    ownerId: string,
    data: CreateCompanyDTO,
    file?: Express.Multer.File,
  ): Promise<void> {
    return await this.prisma.$transaction(async (tx) => {
      let companyImageUrl = null;

      if (file) {
        companyImageUrl = await this.fileStorage.uploadFile(Buckets.company_profile, file);
      }

      const company = await tx.company.create({
        data: {
          ...data,
          ownerId,
          document: removeSpecialCharacters(data.document),
          addressZipcode: removeSpecialCharacters(data.addressZipcode),
          companyImageUrl,
        },
      });

      await tx.branch.create({
        data: {
          companyId: company.id,
          name: data.name,
          document: removeSpecialCharacters(data.document),
        },
      });

      await tx.person.update({
        where: { id: ownerId },
        data: { isFirstAccess: false },
      });
    });
  }

  async findCompanyByDocument(document: string) {
    return await this.prisma.company.findFirst({
      where: { document: removeSpecialCharacters(document), deletedAt: null },
    });
  }

  async findCompanyById(companyId: string) {
    return await this.prisma.company.findUnique({ where: { id: companyId, deletedAt: null } });
  }

  async findCompanyByUserId(ownerId: string) {
    return await this.prisma.company.findFirst({
      where: { ownerId, deletedAt: null },
    });
  }

  async updateCompanyById(companyId: string, data: UpdateCompanyDTO, file?: Express.Multer.File) {
    const company = await this.findCompanyById(companyId);

    let companyImageUrl = null;

    if (file) {
      companyImageUrl = await this.fileStorage.uploadFile(Buckets.company_profile, file);
      if (company?.companyImageUrl) {
        await this.fileStorage.deleteFile(company?.companyImageUrl);
      }
    } else {
      companyImageUrl = company?.companyImageUrl;
    }

    return await this.prisma.company.update({
      where: { id: companyId },
      data: {
        ...data,
        document: removeSpecialCharacters(data.document),
        companyImageUrl,
      },
    });
  }

  async inactivateCompanyById(companyId: string) {
    return await this.prisma.company.update({
      where: { id: companyId },
      data: { deletedAt: getCurrentDateAndTime() },
    });
  }
}
