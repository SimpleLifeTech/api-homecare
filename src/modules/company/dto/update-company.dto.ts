import { IsString } from "class-validator";

export class UpdateCompanyDTO {
  @IsString({ message: "O nome da empresa deve ser uma string" })
  name: string;

  @IsString({ message: "A imagem da empresa deve ser uma string" })
  image: string;

  @IsString({ message: "O CNPJ da empresa deve ser uma string" })
  document: string;
}
