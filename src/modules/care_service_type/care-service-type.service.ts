import { CompanyService } from "@modules/company/company.service";
import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { CacheRepository } from "@shared/shared/cache/cache.repository";
import { GlobalFunctions } from "@shared/shared/utils/functions";

import { CareServiceTypeRepository } from "./dao/care-service-type.repository";
import { CareServiceType } from "@prisma/client";

const { blank, filled } = new GlobalFunctions();

@Injectable()
export class CareServiceTypeService {
  constructor(
    @Inject(CareServiceTypeRepository)
    private readonly careServiceTypeRepository: CareServiceTypeRepository,
    private readonly companyService: CompanyService,
    private readonly cache: CacheRepository,
  ) {}

  async createCareServiceType(companyId: string, name: string) {
    await this.companyService.companyExists(companyId);
    await this.careServiceTypeRepository.createCareServiceType(companyId, name);

    return "Tipo de serviço criado com sucesso!";
  }

  async findCareServiceTypeById(careServiceTypeId: string) {
    await this.careServiceTypeExists(careServiceTypeId);
    return await this.careServiceTypeRepository.findCareServiceTypeById(careServiceTypeId);
  }

  async findCareServiceTypeBySlug(slug: string) {
    return await this.careServiceTypeRepository.findCareServiceTypeBySlug(slug);
  }

  async findCareServiceTypesByCompanyId(companyId: string) {
    return (await this.careServiceTypeRepository.findCareServiceTypesByCompanyId(companyId)) ?? [];
  }

  async updateCareServiceType(careServiceTypeId: string, name: string) {
    await this.careServiceTypeExists(careServiceTypeId);
    await this.careServiceTypeRepository.updateCareServiceType(careServiceTypeId, name);
    await this.cache.del(this.cacheKey(careServiceTypeId));
    return "Tipo de serviço atualizado com sucesso!";
  }

  async inactivateCareServiceType(careServiceTypeId: string) {
    await this.careServiceTypeExists(careServiceTypeId);
    await this.careServiceTypeRepository.inactivateCareServiceType(careServiceTypeId);
    await this.cache.del(this.cacheKey(careServiceTypeId));
    return "Tipo de serviço inativado com sucesso!";
  }

  async careServiceTypeExists(id: string) {
    const cachekey = this.cacheKey(id);
    const careServiceTypeCached = await this.cache.get<CareServiceType>(cachekey);

    if (filled(careServiceTypeCached)) return careServiceTypeCached;

    const careServiceType = await this.careServiceTypeRepository.findCareServiceTypeById(id);

    if (blank(careServiceType)) throw new BadRequestException("Tipo de serviço não encontrado");

    await this.cache.set(cachekey, careServiceType);
    return careServiceType;
  }

  private cacheKey(id: string) {
    return `care-service-type:${id}`;
  }
}
