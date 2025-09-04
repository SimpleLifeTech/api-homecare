import { PersonModel } from "@modules/models/person.model";
import { CreatePersonDTO } from "@modules/person/dto/create-person.dto";
import { UpdatePersonDTO } from "@modules/person/dto/update-person.dto";

export const mockCreatePersonDTO: CreatePersonDTO = {
  name: "John Doe",
  email: "john@example.com",
  password: "123456",
  document: "12345678900",
  birthdate: "1990-01-01",
  phone: "11999999999",
  address: "Rua Teste",
  addressNumber: "123",
  addressComplement: "Apto 1",
  addressCity: "São Paulo",
  addressState: "SP",
  addressZipcode: "12345678",
};

export const mockUpdatePersonDTO: UpdatePersonDTO = {
  name: "John Doe Updated",
  email: "john.updated@example.com",
  phone: "11988888888",
  document: "12345678900",
  address: "Rua Teste Updated",
  addressNumber: "123",
  addressComplement: "Apto 1",
  addressCity: "São Paulo",
  addressState: "SP",
  addressZipcode: "12345678",
};

export const mockPersonModel: PersonModel = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  name: "John Doe",
  email: "john@example.com",
  password: "hashedPassword",
  document: "12345678900",
  birthdate: new Date("1990-01-01"),
  profileImageUrl: null,
  phone: "11999999999",
  address: "Rua Teste",
  addressNumber: "123",
  addressComplement: "Apto 1",
  addressCity: "São Paulo",
  addressState: "SP",
  addressZipcode: "12345678",
  isFirstAccess: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};
