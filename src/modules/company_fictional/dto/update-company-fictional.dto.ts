import { IsNotEmpty, IsString } from "class-validator";

export class UpdateCompanyFictionalDTO {
  @IsString({ message: "O nome da empresa deve ser uma string" })
  @IsNotEmpty({ message: "O nome da empresa deve ser preenchido" })
  name: string;
}
