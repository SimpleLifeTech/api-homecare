import { branch } from "@prisma/client";

export class BranchModel implements branch {
  id: string;
  company_id: string;
  name: string;
  address: string;
  address_number: string;
  address_complement: string;
  address_city: string;
  address_state: string;
  address_zipcode: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;

  constructor(partial: Partial<BranchModel>) {
    Object.assign(this, partial);
  }
}
