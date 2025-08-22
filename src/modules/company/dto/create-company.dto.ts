import { IsNotEmpty, IsString } from "class-validator";

export class CreateCompanyDTO {
  @IsString({ message: "O nome da empresa deve ser uma string" })
  @IsNotEmpty({ message: "O nome da empresa deve ser preenchido" })
  name: string;

  @IsString({ message: "O CNPJ da empresa deve ser uma string" })
  @IsNotEmpty({ message: "O CNPJ da empresa deve ser preenchido" })
  document: string;

  @IsString({ message: "O endereço da empresa deve ser uma string" })
  @IsNotEmpty({ message: "O endereço da empresa deve ser preenchida" })
  address: string;

  @IsString({ message: "O numero do endereço da empresa deve ser uma string" })
  @IsNotEmpty({ message: "O numero do endereço da empresa deve ser preenchido" })
  addressNumber: string;

  @IsString({ message: "O complemento do endereço da empresa deve ser uma string" })
  addressComplement: string;

  @IsString({ message: "A cidade da empresa deve ser uma string" })
  @IsNotEmpty({ message: "A cidade da empresa deve ser preenchido" })
  addressCity: string;

  @IsString({ message: "O estado da empresa deve ser uma string" })
  @IsNotEmpty({ message: "O estado da empresa deve ser preenchido" })
  addressState: string;

  @IsString({ message: "O CEP da empresa deve ser uma string" })
  @IsNotEmpty({ message: "O CEP da empresa deve ser preenchido" })
  addressZipcode: string;
}
