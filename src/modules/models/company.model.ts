import { company } from "@prisma/client";

export class CompanyModel implements company {
  id: string;
  person_id: string;
  name: string;
  image: string;
  document: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;

  constructor(partial: Partial<CompanyModel>) {
    Object.assign(this, partial);
  }
}
