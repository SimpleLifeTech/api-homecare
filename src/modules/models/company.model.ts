import { Company, CompanyType,  } from "@prisma/client";

export class CompanyModel implements Company {
  id: string;
  ownerId: string;
  type: CompanyType;
  name: string;
  companyImageUrl: string | null;
  document: string;
  address: string;
  addressNumber: string;
  addressComplement: string | null;
  addressCity: string;
  addressState: string;
  addressZipcode: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;

  constructor(partial: Partial<CompanyModel>) {
    Object.assign(this, partial);
  }
}
