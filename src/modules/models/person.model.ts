import { person } from "@prisma/client";

export class PersonModel implements person {
  id: string;
  name: string;
  email: string;
  password: string;
  document: string;
  image: string;
  phone: string;
  address: string;
  address_number: string;
  address_complement: string;
  address_city: string;
  address_state: string;
  address_zipcode: string;
  is_first_access: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;

  constructor(partial: Partial<PersonModel>) {
    Object.assign(this, partial);
  }
}
