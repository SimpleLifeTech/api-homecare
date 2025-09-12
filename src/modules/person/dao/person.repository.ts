import { PersonModel } from "@modules/models/person.model";
import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { FileStorage } from "@shared/shared/externals/file-storage/file-storage";
import { OriginBucket } from "@shared/shared/externals/file-storage/filte-storage.types";
import { GlobalFunctions } from "@shared/shared/utils/functions";
import { PrismaService } from "src/database/prisma/prisma.service";

import { CreatePersonDTO } from "../dto/create-person.dto";
import { UpdatePersonDTO } from "../dto/update-person.dto";

const { getCurrentDateAndTime } = new GlobalFunctions();

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

  async findPersonById<T extends Prisma.PersonInclude | undefined = undefined>(
    personId: string,
    include?: T,
  ): Promise<Prisma.PersonGetPayload<{ include: T }> | null> {
    return await this.prisma.person.findUnique({
      where: { id: personId, deletedAt: null },
      include,
    });
  }

  async findPersonByDocument(document: string): Promise<PersonModel | null> {
    return await this.prisma.person.findFirst({ where: { document, deletedAt: null } });
  }

  async findPersonByEmail(email: string): Promise<PersonModel | null> {
    return await this.prisma.person.findFirst({ where: { email, deletedAt: null } });
  }

  async findOrCreatePerson(data: CreatePersonDTO): Promise<PersonModel> {
    const person = await this.prisma.person.findFirst({
      where: { OR: [{ document: data.document }, { email: data.email }], deletedAt: null },
    });

    if (person) return person;

    return await this.prisma.person.create({ data });
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
      data: { deletedAt: getCurrentDateAndTime() },
    });
  }
}
