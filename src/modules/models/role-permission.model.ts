import { role_permission } from "@prisma/client";

export class RolePermissionModel implements role_permission {
  id: string;
  role_id: number;
  feed: boolean;
  delete: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;

  constructor(partial: Partial<RolePermissionModel>) {
    Object.assign(this, partial);
  }
}
