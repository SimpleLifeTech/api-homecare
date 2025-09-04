import { IsNotEmpty, IsString } from "class-validator";

export class CreateBranchDTO {
  @IsString({ message: "O nome da filial deve ser uma string" })
  @IsNotEmpty({ message: "O nome da filial deve ser preenchido" })
  name: string;

  @IsString({ message: "O documento da filial deve ser uma string" })
  @IsNotEmpty({ message: "O documento da filial deve ser preenchido" })
  document: string;
}
