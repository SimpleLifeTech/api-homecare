import { IsNotEmpty, IsString } from "class-validator";

export class CreateBranchDTO {
  @IsString({ message: "O nome da filial deve ser uma string" })
  @IsNotEmpty({ message: "O nome da filial deve ser preenchido" })
  name: string;

  @IsString({ message: "O endereço da filial deve ser uma string" })
  @IsNotEmpty({ message: "O endereço da filial deve ser preenchida" })
  address: string;

  @IsString({ message: "O numero do endereço da filial deve ser uma string" })
  @IsNotEmpty({ message: "O numero do endereço da filial deve ser preenchido" })
  address_number: string;

  @IsString({ message: "O complemento do endereço da filial deve ser uma string" })
  address_complement: string;

  @IsString({ message: "A cidade da filial deve ser uma string" })
  @IsNotEmpty({ message: "A cidade da filial deve ser preenchido" })
  address_city: string;

  @IsString({ message: "O estado da filial deve ser uma string" })
  @IsNotEmpty({ message: "O estado da filial deve ser preenchido" })
  address_state: string;

  @IsString({ message: "O CEP da filial deve ser uma string" })
  @IsNotEmpty({ message: "O CEP da filial deve ser preenchido" })
  address_zipcode: string;
}
