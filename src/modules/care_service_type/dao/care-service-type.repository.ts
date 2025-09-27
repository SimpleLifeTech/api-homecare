import { Injectable } from "@nestjs/common";
import { GlobalFunctions } from "@shared/shared/utils/functions";
import slugify from "slugify";
import { PrismaService } from "src/database/prisma/prisma.service";

const { getCurrentDateAndTime } = new GlobalFunctions();

@Injectable()
export class CareServiceTypeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createCareServiceType(companyId: string, name: string) {
    return await this.prisma.careServiceType.create({
      data: { companyId, name, slug: slugify(name, { lower: true, strict: true }) },
    });
  }

  async findCareServiceTypeById(id: string) {
    return await this.prisma.careServiceType.findUnique({ where: { id, deletedAt: null } });
  }

  async findCareServiceTypeBySlug(slug: string) {
    return await this.prisma.careServiceType.findFirst({ where: { slug, deletedAt: null } });
  }

  async findCareServiceTypeByIds(ids: string[]) {
    return await this.prisma.careServiceType.findMany({
      where: { id: { in: ids }, deletedAt: null },
    });
  }

  async findCareServiceTypesByCompanyId(companyId: string) {
    return await this.prisma.careServiceType.findMany({ where: { companyId, deletedAt: null } });
  }

  async updateCareServiceType(id: string, name: string) {
    return await this.prisma.careServiceType.update({
      where: { id },
      data: { name, slug: slugify(name, { lower: true, strict: true }) },
    });
  }

  async inactivateCareServiceType(id: string) {
    return await this.prisma.careServiceType.update({
      where: { id },
      data: { deletedAt: getCurrentDateAndTime() },
    });
  }
}
