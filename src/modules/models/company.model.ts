import { Company } from "@prisma/client";

export class CompanyModel implements Company {
  id: string;
  personId: string;
  name: string;
  image: string;
  document: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;

  constructor(partial: Partial<CompanyModel>) {
    Object.assign(this, partial);
  }
}
