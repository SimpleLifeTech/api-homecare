import { PersonPermissionModel } from "@modules/models/person-permission.model";
import { DataSource, UpdateResult } from "typeorm";

export class PersonPermissionRepository {
  constructor(private dataSource: DataSource) {}
  private readonly repository = this.dataSource.getRepository(PersonPermissionModel);

  async createPersonPermission(
    personId: string,
    functionPermissionId: string,
  ): Promise<PersonPermissionModel> {
    return this.repository.save({
      person_id: personId,
      function_permission_id: functionPermissionId,
    });
  }

  async findPermissionByPersonId(personId: string): Promise<PersonPermissionModel[]> {
    return this.repository.find({ where: { person_id: personId } });
  }

  async findPermissionById(personPermissionId: string): Promise<PersonPermissionModel> {
    return this.repository.findOneBy({ id: personPermissionId });
  }

  async updatePermissionById(
    personPermissionId: string,
    functionPermissionId: string,
  ): Promise<UpdateResult> {
    return this.repository.update(
      { id: personPermissionId },
      { function_permission_id: functionPermissionId },
    );
  }

  async inactivatePermissionById(personPermissionId: string): Promise<UpdateResult> {
    return this.repository.softDelete({ id: personPermissionId });
  }
}
