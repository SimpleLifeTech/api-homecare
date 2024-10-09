import { IsNotEmpty, IsString } from "class-validator";

export class CreateCompanyDTO {
  @IsString({ message: "O nome da empresa deve ser uma string" })
  @IsNotEmpty({ message: "O nome da empresa deve ser preenchido" })
  name: string;

  @IsString({ message: "A imagem da empresa deve ser uma string" })
  image: string;

  @IsString({ message: "O CNPJ da empresa deve ser uma string" })
  @IsNotEmpty({ message: "O CNPJ da empresa deve ser preenchido" })
  document: string;
}
