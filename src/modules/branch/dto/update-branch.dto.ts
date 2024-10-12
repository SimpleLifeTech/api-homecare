import { IsString } from "class-validator";

export class UpdateBranchDTO {
  @IsString({ message: "O nome da filial deve ser uma string" })
  name: string;

  @IsString({ message: "O endereço da filial deve ser uma string" })
  address: string;

  @IsString({ message: "O numero do endereço da filial deve ser uma string" })
  address_number: string;

  @IsString({ message: "O complemento do endereço da filial deve ser uma string" })
  address_complement: string;

  @IsString({ message: "A cidade da filial deve ser uma string" })
  address_city: string;

  @IsString({ message: "O estado da filial deve ser uma string" })
  address_state: string;

  @IsString({ message: "O CEP da filial deve ser uma string" })
  address_zipcode: string;
}
