import { PersonModel } from "@modules/models/person.model";
import { Injectable } from "@nestjs/common";
import { FileStorage } from "@shared/shared/externals/file-storage/file-storage";
import { OriginBucket } from "@shared/shared/externals/file-storage/filte-storage.types";
import { GlobalFunctions } from "@shared/shared/utils/functions";
import { PrismaService } from "src/database/prisma/prisma.service";

import { CreatePersonDTO } from "../dto/create-person.dto";
import { UpdatePersonDTO } from "../dto/update-person.dto";

const globalFunction = new GlobalFunctions();

@Injectable()
export class PersonRepository {
  constructor(
    private prisma: PrismaService,
    private fileStorage: FileStorage,
  ) {}

  async createPerson(data: CreatePersonDTO, file: Express.Multer.File): Promise<PersonModel> {
    return await this.prisma.$transaction(async (tx) => {
      const user = await tx.person.create({
        data: { ...data, image: null, is_first_access: false },
      });

      const image = await this.fileStorage.uploadImage(user.id, OriginBucket.PERSON, file);

      return await tx.person.update({
        where: { id: user.id },
        data: { image },
      });
    });
  }

  async findPersonById(personId: string): Promise<PersonModel | null> {
    return await this.prisma.person.findUnique({ where: { id: personId, deleted_at: null } });
  }

  async findPersonByDocument(document: string): Promise<PersonModel | null> {
    return await this.prisma.person.findFirst({ where: { document, deleted_at: null } });
  }

  async findPersonByEmail(email: string): Promise<PersonModel | null> {
    return await this.prisma.person.findFirst({ where: { email, deleted_at: null } });
  }

  async updatePersonById(
    personId: string,
    data: UpdatePersonDTO,
    file: Express.Multer.File,
  ): Promise<PersonModel> {
    return this.prisma.$transaction(async (tx) => {
      const image = await this.fileStorage.uploadImage(personId, OriginBucket.PERSON, file);

      return await tx.person.update({ where: { id: personId }, data: { ...data, image } });
    });
  }

  async inactivatePersonById(personId: string): Promise<PersonModel> {
    return this.prisma.person.update({
      where: { id: personId },
      data: { deleted_at: globalFunction.getCurrentDateAndTime() },
    });
  }
}
