import { RolePermission } from "@prisma/client";

export class RolePermissionModel implements RolePermission {
  id: string;
  roleId: number;
  feed: boolean;
  delete: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;

  constructor(partial: Partial<RolePermissionModel>) {
    Object.assign(this, partial);
  }
}
