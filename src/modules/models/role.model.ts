import { role } from "@prisma/client";

export class RoleModel implements role {
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;

  constructor(partial: Partial<RoleModel>) {
    Object.assign(this, partial);
  }
}
