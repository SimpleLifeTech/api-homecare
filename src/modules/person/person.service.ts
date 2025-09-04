import { BadRequestException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { GlobalFunctions } from "@shared/shared/utils/functions";
import { APIResponse, CoreResponse, ErrorTypes } from "@shared/shared/utils/response";
import * as bcrypt from "bcryptjs";

import { PersonRepository } from "./dao/person.repository";
import { CreatePersonDTO } from "./dto/create-person.dto";
import { UpdatePersonDTO } from "./dto/update-person.dto";
import { Person } from "./types/person.types";

const response = new CoreResponse();
const globalFunctions = new GlobalFunctions();

@Injectable()
export class PersonService {
  constructor(@Inject(PersonRepository) protected readonly personRepository: PersonRepository) {}

  async createPerson(
    data: CreatePersonDTO,
    file?: Express.Multer.File,
  ): Promise<APIResponse<string, ErrorTypes>> {
    const personExists = await this.personRepository.findPersonByDocument(data.document);

    if (globalFunctions.blank(personExists)) throw new BadRequestException("Pessoa já cadastrada");

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(data.password, salt);

    if (globalFunctions.blank(hashedPassword)) throw new BadRequestException("Senha não criada");

    const user = {
      ...data,
      password: hashedPassword,
      document: globalFunctions.removeSpecialCharacters(data.document),
      addressZipcode: globalFunctions.removeSpecialCharacters(data.addressZipcode),
    };

    await this.personRepository.createPerson(user, file);

    return response.success("Pessoa criada com sucesso!", HttpStatus.CREATED);
  }

  async findPersonById(personId: string): Promise<APIResponse<Person, ErrorTypes>> {
    const person = await this.getPersonById(personId);
    const formatted = globalFunctions.excludeFromObject(person, ["password"]);

    return response.success(formatted);
  }

  async updatePersonById(
    personId: string,
    data: UpdatePersonDTO,
    file?: Express.Multer.File,
  ): Promise<APIResponse<string, ErrorTypes>> {
    await this.getPersonById(personId);
    await this.personRepository.updatePersonById(personId, data, file);

    return response.success("Pessoa atualizada com sucesso!");
  }

  async inactivatePersonById(personId: string): Promise<APIResponse<string, ErrorTypes>> {
    await this.getPersonById(personId);
    await this.personRepository.inactivatePersonById(personId);

    return response.success("Pessoa inativada com sucesso!");
  }

  private async getPersonById(personId: string) {
    const person = await this.personRepository.findPersonById(personId);

    if (globalFunctions.blank(person)) throw new BadRequestException("Pessoa não encontrada");

    return person;
  }
}
