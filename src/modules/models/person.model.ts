import { Person } from "@prisma/client";

export class PersonModel implements Person {
  id: string;
  name: string;
  email: string;
  password: string;
  document: string;
  image: string;
  phone: string;
  address: string;
  addressNumber: string;
  addressComplement: string;
  addressCity: string;
  addressState: string;
  addressZipcode: string;
  isFirstAccess: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;

  constructor(partial: Partial<PersonModel>) {
    Object.assign(this, partial);
  }
}
