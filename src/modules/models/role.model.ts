import { Role } from "@prisma/client";

export class RoleModel implements Role {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;

  constructor(partial: Partial<RoleModel>) {
    Object.assign(this, partial);
  }
}
