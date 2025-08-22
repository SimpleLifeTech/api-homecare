import { Branch } from "@prisma/client";

export class BranchModel implements Branch {
  id: string;
  companyId: string;
  name: string;
  address: string;
  addressNumber: string;
  addressComplement: string;
  addressCity: string;
  addressState: string;
  addressZipcode: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;

  constructor(partial: Partial<BranchModel>) {
    Object.assign(this, partial);
  }
}
