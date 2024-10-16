import { IsNotEmpty, IsString } from "class-validator";

export class CreatePersonDTO {
  @IsString({ message: "O nome do usuário deve ser uma string" })
  @IsNotEmpty({ message: "O nome do usuário deve ser preenchido" })
  name: string;

  @IsString({ message: "O e-mail do usuário deve ser uma string" })
  @IsNotEmpty({ message: "O e-mail do usuário deve ser preenchido" })
  email: string;

  @IsString({ message: "A senha do usuário deve ser uma string" })
  @IsNotEmpty({ message: "A senha do usuário deve ser preenchido" })
  password: string;

  @IsString({ message: "O CPF do usuário deve ser uma string" })
  @IsNotEmpty({ message: "O CPF do usuário deve ser preenchido" })
  document: string;

  @IsString({ message: "A imagem do usuário deve ser uma string" })
  image: string;

  @IsString({ message: "O número de telefone/celular do usuário deve ser uma string" })
  @IsNotEmpty({ message: "O número de telefone/celular do usuário deve ser preenchido" })
  phone: string;

  @IsString({ message: "O endereço do usuário deve ser uma string" })
  @IsNotEmpty({ message: "O endereço do usuário deve ser preenchida" })
  address: string;

  @IsString({ message: "O numero do endereço do usuário deve ser uma string" })
  @IsNotEmpty({ message: "O numero do endereço do usuário deve ser preenchido" })
  address_number: string;

  @IsString({ message: "O complemento do endereço do usuário deve ser uma string" })
  address_complement: string;

  @IsString({ message: "A cidade do usuário deve ser uma string" })
  @IsNotEmpty({ message: "A cidade do usuário deve ser preenchido" })
  address_city: string;

  @IsString({ message: "O estado do usuário deve ser uma string" })
  @IsNotEmpty({ message: "O estado do usuário deve ser preenchido" })
  address_state: string;

  @IsString({ message: "O CEP do usuário deve ser uma string" })
  @IsNotEmpty({ message: "O CEP do usuário deve ser preenchido" })
  address_zipcode: string;
}
