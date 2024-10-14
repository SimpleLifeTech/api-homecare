import { PersonModel } from "@modules/models/person.model";
import { DataSource } from "typeorm";

export class PersonRepository {
  constructor(private dataSource: DataSource) {}
  private readonly repository = this.dataSource.getRepository(PersonModel);

  async findPersonById(personId: string): Promise<PersonModel> {
    return this.repository.findOneBy({ id: personId });
  }
}
