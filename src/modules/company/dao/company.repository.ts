import { Injectable } from '@nestjs/common';
import { FileStorage } from '@shared/shared/externals/file-storage/file-storage';
import { OriginBucket } from '@shared/shared/externals/file-storage/filte-storage.types';
import { GlobalFunctions } from '@shared/shared/utils/functions';
import { PrismaService } from 'src/database/prisma/prisma.service';

import { CreateCompanyDTO } from '../dto/create-company.dto';
import { UpdateCompanyDTO } from '../dto/update-company.dto';

const { getCurrentDateAndTime } = new GlobalFunctions();

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
        companyImageUrl = await this.fileStorage.uploadImage(
          data.document,
          OriginBucket.COMPANY,
          file,
        );
      }

      const company = await tx.company.create({
        data: {
          ...data,
          ownerId,
          companyImageUrl,
        },
      });

      await tx.branch.create({
        data: {
          companyId: company.id,
          name: data.name,
          document: data.document,
        },
      });

      await tx.person.update({
        where: { id: ownerId },
        data: { isFirstAccess: false },
      });
    });
  }

  async findCompanyByDocument(document: string) {
    return await this.prisma.company.findFirst({ where: { document, deletedAt: null } });
  }

  async findCompanyById(companyId: string) {
    return await this.prisma.company.findUnique({ where: { id: companyId, deletedAt: null } });
  }

  async findCompanyByUserId(ownerId: string) {
    return await this.prisma.company.findFirst({
      where: { ownerId, deletedAt: null },
    });
  }

  async updateCompanyById(
    companyId: string,
    data: UpdateCompanyDTO,
    file?: Express.Multer.File,
  ) {
    const company = await this.findCompanyById(companyId);

    const companyImageUrl = file
      ? await this.fileStorage.uploadImage(companyId, OriginBucket.COMPANY, file)
      : company?.companyImageUrl;

    return await this.prisma.company.update({
      where: { id: companyId },
      data: { ...data, companyImageUrl },
    });
  }

  async inactivateCompanyById(companyId: string) {
    return await this.prisma.company.update({
      where: { id: companyId },
      data: { deletedAt: getCurrentDateAndTime() },
    });
  }
}
