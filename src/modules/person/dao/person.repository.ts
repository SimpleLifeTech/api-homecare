import { PersonModel } from "@modules/models/person.model";
import { Injectable } from "@nestjs/common";
import { GlobalFunctions } from "@shared/shared/utils/functions";
import { PrismaService } from "src/database/prisma/prisma.service";

import { CreatePersonDTO } from "../dto/create-person.dto";
import { UpdatePersonDTO } from "../dto/update-person.dto";

const globalFunction = new GlobalFunctions();

@Injectable()
export class PersonRepository {
  constructor(private prisma: PrismaService) {}

  async createPerson(data: CreatePersonDTO): Promise<PersonModel> {
    return await this.prisma.person.create({ data: { ...data } });
  }

  async findPersonById(personId: string): Promise<PersonModel | null> {
    return await this.prisma.person.findUnique({ where: { id: personId, deleted_at: null } });
  }

  async findPersonByDocument(document: string): Promise<PersonModel | null> {
    return await this.prisma.person.findFirst({ where: { document, deleted_at: null } });
  }

  async updatePersonById(personId: string, data: UpdatePersonDTO): Promise<PersonModel> {
    return this.prisma.person.update({ where: { id: personId }, data: { ...data } });
  }

  async inactivatePersonById(personId: string): Promise<PersonModel> {
    return this.prisma.person.update({
      where: { id: personId },
      data: { deleted_at: globalFunction.getCurrentDateAndTime() },
    });
  }
}
