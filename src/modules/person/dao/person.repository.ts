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
    private readonly prisma: PrismaService,
    private readonly fileStorage: FileStorage,
  ) {}

  async createPerson(data: CreatePersonDTO, file: Express.Multer.File): Promise<PersonModel> {
    const user = await this.prisma.person.create({
      data: { ...data, profileImageUrl: null, isFirstAccess: true },
    });

    if (file) {
      const profileImageUrl = await this.fileStorage.uploadImage(
        user.id,
        OriginBucket.PERSON,
        file,
      );
      return await this.prisma.person.update({
        where: { id: user.id },
        data: { profileImageUrl },
      });
    }

    return user;
  }

  async findPersonById(personId: string): Promise<PersonModel | null> {
    return await this.prisma.person.findUnique({ where: { id: personId, deletedAt: null } });
  }

  async findPersonByDocument(document: string): Promise<PersonModel | null> {
    return await this.prisma.person.findFirst({ where: { document, deletedAt: null } });
  }

  async findPersonByEmail(email: string): Promise<PersonModel | null> {
    return await this.prisma.person.findFirst({ where: { email, deletedAt: null } });
  }

  async updatePersonById(
    personId: string,
    data: UpdatePersonDTO,
    file?: Express.Multer.File,
  ): Promise<PersonModel> {
    const person = await this.findPersonById(personId);

    const profileImageUrl = file
      ? await this.fileStorage.uploadImage(personId, OriginBucket.PERSON, file)
      : person?.profileImageUrl;

    return await this.prisma.person.update({
      where: { id: personId },
      data: { ...data, profileImageUrl },
    });
  }

  async inactivatePersonById(personId: string): Promise<PersonModel> {
    return this.prisma.person.update({
      where: { id: personId },
      data: { deletedAt: globalFunction.getCurrentDateAndTime() },
    });
  }
}
