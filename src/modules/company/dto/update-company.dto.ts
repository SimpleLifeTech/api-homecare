import { IsString, MinLength } from "class-validator";

export class UpdateCompanyDTO {
  @IsString({ message: "O nome da empresa deve ser uma string" })
  name: string;

  @IsString({ message: "O CNPJ da empresa deve ser uma string" })
  @MinLength(14, { message: "O CNPJ deve ter no mínimo 14 caracteres" })
  document: string;
}
