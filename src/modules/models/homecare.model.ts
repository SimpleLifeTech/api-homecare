import { Homecare } from "@prisma/client";

export class HomecareModel implements Homecare {
  id: string;
  branchId: string;
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

  constructor(partial: Partial<HomecareModel>) {
    Object.assign(this, partial);
  }
}
