export interface Person {
  id: string;
  name: string;
  email: string;
  document: string;
  birthdate: Date;
  profileImageUrl: string | null;
  phone: string;
  address: string;
  addressNumber: string;
  addressComplement: string | null;
  addressCity: string;
  addressState: string;
  addressZipcode: string;
  isFirstAccess: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
