import { Profile } from "@prisma/client";

export class ProfileModel implements Profile {
  id: string;
  branchId: string;
  employeeId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;

  constructor(partial: Partial<ProfileModel>) {
    Object.assign(this, partial);
  }
}
