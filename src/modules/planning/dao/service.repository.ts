import { GlobalFunctions } from "@shared/shared/utils/functions";
import { PrismaService } from "src/database/prisma/prisma.service";

// import { CreateServiceDTO } from "../dto/create-planning.dto";
// import { UpdateServiceDTO } from "../dto/update-planning.dto";
import { Injectable } from "@nestjs/common";
import { Service } from "@prisma/client";

const { getCurrentDateAndTime } = new GlobalFunctions();

@Injectable()
export class ServiceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createService(data: Service) {
    return this.prisma.service.create({ data: { ...data } });
  }

  // async findServiceById(planningId: string) {
  //   return this.prisma.planning.findUnique({ where: { id: planningId, deletedAt: null } });
  // }

  // async updateServiceById(planningId: string, data: UpdateServiceDTO) {
  //   return this.prisma.planning.update({ where: { id: planningId }, data: { ...data } });
  // }

  // async inactivateServiceById(planningId: string) {
  //   return this.prisma.planning.update({
  //     where: { id: planningId },
  //     data: { deletedAt: getCurrentDateAndTime() },
  //   });
  // }
}
