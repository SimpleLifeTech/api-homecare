import { PersonModel } from "@modules/models/person.model";
import { HttpStatus } from "@nestjs/common";
import { APIResponse, CoreResponse, ErrorTypes } from "@shared/shared/utils/response";

import { PersonRoles } from "./business/person.roles";
import { PersonRepository } from "./dao/person.repository";
import { CreatePersonDTO } from "./dto/create-person.dto";
import { UpdatePersonDTO } from "./dto/update-person.dto";

export class PersonService extends PersonRoles {
  constructor(
    protected readonly personRepository: PersonRepository,
    protected readonly response = new CoreResponse(),
  ) {
    super();
  }

  async createPerson(data: CreatePersonDTO): Promise<APIResponse<string, ErrorTypes>> {
    const personExists = await this.personRepository.findPersonByDocument(data.document);

    await this.personAlreadyExists(personExists);

    await this.personRepository.createPerson(data);

    return this.response.success("Pessoa criada com sucesso!", HttpStatus.CREATED);
  }

  async findPersonById(personId: string): Promise<APIResponse<PersonModel, ErrorTypes>> {
    const person = await this.personRepository.findPersonById(personId);

    await this.personNotFound(person);

    return this.response.success(person);
  }

  async updatePersonById(
    personId: string,
    data: UpdatePersonDTO,
  ): Promise<APIResponse<string, ErrorTypes>> {
    const person = await this.personRepository.findPersonById(personId);

    await this.personNotFound(person);

    await this.personRepository.updatePersonById(personId, data);

    return this.response.success("Pessoa atualizada com sucesso!");
  }

  async inactivatePersonById(personId: string): Promise<APIResponse<string, ErrorTypes>> {
    const person = await this.personRepository.findPersonById(personId);

    await this.personNotFound(person);

    await this.personRepository.inactivatePersonById(personId);

    return this.response.success("Pessoa inativada com sucesso!");
  }
}
