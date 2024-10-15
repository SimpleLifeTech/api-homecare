import { PersonModel } from "@modules/models/person.model";
import { DataSource, UpdateResult } from "typeorm";

import { CreatePersonDTO } from "../dto/create-person.dto";
import { UpdatePersonDTO } from "../dto/update-person.dto";

export class PersonRepository {
  constructor(private dataSource: DataSource) {}
  private readonly repository = this.dataSource.getRepository(PersonModel);

  async createPerson(data: CreatePersonDTO): Promise<PersonModel> {
    return this.repository.save(data);
  }

  async findPersonById(personId: string): Promise<PersonModel> {
    return this.repository.findOneBy({ id: personId });
  }

  async findPersonByDocument(document: string): Promise<PersonModel> {
    return this.repository.findOneBy({ document });
  }

  async updatePersonById(personId: string, data: UpdatePersonDTO): Promise<UpdateResult> {
    return this.repository.update({ id: personId }, data);
  }

  async inactivatePersonById(personId: string): Promise<UpdateResult> {
    return this.repository.softDelete({ id: personId });
  }
}
