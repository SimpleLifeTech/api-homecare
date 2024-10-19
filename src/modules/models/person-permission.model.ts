import { person_permission } from "@prisma/client";

export class PersonPermissionModel implements person_permission {
  id: string;
  person_id: string;
  role_permission_id: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;

  constructor(partial: Partial<PersonPermissionModel>) {
    Object.assign(this, partial);
  }
}
