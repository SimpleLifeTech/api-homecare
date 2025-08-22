import { PersonPermission } from "@prisma/client";

export class PersonPermissionModel implements PersonPermission {
  id: string;
  personId: string;
  rolePermissionId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;

  constructor(partial: Partial<PersonPermissionModel>) {
    Object.assign(this, partial);
  }
}
