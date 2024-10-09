import { PrismaService } from "@prisma/prisma/prisma.service"
import { Prisma } from "@prisma/client"

export class UserCreditLogPrismaRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserCreditLogUncheckedCreateInput) {
    await this.prisma.userCreditLog.create({ data })
  }
}
