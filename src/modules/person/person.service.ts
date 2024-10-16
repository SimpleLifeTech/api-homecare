import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { GlobalFunctions } from "@shared/shared/utils/functions";
import { APIResponse, CoreResponse, ErrorTypes } from "@shared/shared/utils/response";
import * as bcrypt from "bcryptjs";

import { PersonRoles } from "./business/person.roles";
import { PersonRepository } from "./dao/person.repository";
import { CreatePersonDTO } from "./dto/create-person.dto";
import { UpdatePersonDTO } from "./dto/update-person.dto";
import { Person } from "./types/person.types";

const response = new CoreResponse();
const globalFunctions = new GlobalFunctions();

@Injectable()
export class PersonService extends PersonRoles {
  constructor(@Inject(PersonRepository) protected readonly personRepository: PersonRepository) {
    super();
  }

  async createPerson(data: CreatePersonDTO): Promise<APIResponse<string, ErrorTypes>> {
    const personExists = await this.personRepository.findPersonByDocument(data.document);

    await this.personAlreadyExists(personExists);

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(data.password, salt);

    await this.passwordNotCreated(hashedPassword);

    const user = {
      ...data,
      password: hashedPassword,
      document: globalFunctions.removeSpecialCharacters(data.document),
      address_zipcode: globalFunctions.removeSpecialCharacters(data.address_zipcode),
    };

    await this.personRepository.createPerson(user);

    return response.success("Pessoa criada com sucesso!", HttpStatus.CREATED);
  }

  async findPersonById(personId: string): Promise<APIResponse<Person, ErrorTypes>> {
    const person = await this.personRepository.findPersonById(personId);

    await this.personNotFound(person);

    const formatted = globalFunctions.excludeFromObject(person, ["password"]);

    return response.success(formatted);
  }

  async updatePersonById(
    personId: string,
    data: UpdatePersonDTO,
  ): Promise<APIResponse<string, ErrorTypes>> {
    const person = await this.personRepository.findPersonById(personId);

    await this.personNotFound(person);

    await this.personRepository.updatePersonById(personId, data);

    return response.success("Pessoa atualizada com sucesso!");
  }

  async inactivatePersonById(personId: string): Promise<APIResponse<string, ErrorTypes>> {
    const person = await this.personRepository.findPersonById(personId);

    await this.personNotFound(person);

    await this.personRepository.inactivatePersonById(personId);

    return response.success("Pessoa inativada com sucesso!");
  }
}
