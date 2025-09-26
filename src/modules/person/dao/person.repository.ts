import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { GlobalFunctions } from '@shared/shared/utils/functions';
import { PrismaService } from 'src/database/prisma/prisma.service';

import { CreatePersonDTO } from '../dto/create-person.dto';
import { UpdatePersonDTO } from '../dto/update-person.dto';

const { getCurrentDateAndTime } = new GlobalFunctions();

@Injectable()
export class PersonRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async createPerson(data: CreatePersonDTO) {
    return await this.prisma.person.create({
      data: { ...data, isFirstAccess: true },
    });
  }

  async findPersonById<T extends Prisma.PersonInclude | undefined = undefined>(
    personId: string,
    include?: T,
  ): Promise<Prisma.PersonGetPayload<{ include: T }> | null> {
    return await this.prisma.person.findUnique({
      where: { id: personId, deletedAt: null },
      include,
    });
  }

  async findPersonByDocument(document: string) {
    return await this.prisma.person.findFirst({ where: { document, deletedAt: null } });
  }

  async findPersonByEmail(email: string) {
    return await this.prisma.person.findFirst({ where: { email, deletedAt: null } });
  }

  async findOrCreatePerson(data: CreatePersonDTO) {
    const person = await this.prisma.person.findFirst({
      where: { OR: [{ document: data.document }, { email: data.email }], deletedAt: null },
    });

    if (person) return person;

    return await this.prisma.person.create({ data });
  }

  async updatePersonById(
    personId: string,
    data: UpdatePersonDTO,
  ) {
    return await this.prisma.person.update({
      where: { id: personId },
      data: { ...data },
    });
  }

  async inactivatePersonById(personId: string) {
    return this.prisma.person.update({
      where: { id: personId },
      data: { deletedAt: getCurrentDateAndTime() },
    });
  }
}
