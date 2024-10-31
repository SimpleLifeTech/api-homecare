import { IsString } from "class-validator";

export class UpdatePersonDTO {
  @IsString({ message: "O nome do usuário deve ser uma string" })
  name: string;

  @IsString({ message: "O e-mail do usuário deve ser uma string" })
  email: string;

  @IsString({ message: "O CPF do usuário deve ser uma string" })
  document: string;

  @IsString({ message: "O número de telefone/celular do usuário deve ser uma string" })
  phone: string;

  @IsString({ message: "O endereço do usuário deve ser uma string" })
  address: string;

  @IsString({ message: "O numero do endereço do usuário deve ser uma string" })
  address_number: string;

  @IsString({ message: "O complemento do endereço do usuário deve ser uma string" })
  address_complement: string;

  @IsString({ message: "A cidade do usuário deve ser uma string" })
  address_city: string;

  @IsString({ message: "O estado do usuário deve ser uma string" })
  address_state: string;

  @IsString({ message: "O CEP do usuário deve ser uma string" })
  address_zipcode: string;
}
