import { IsString } from "class-validator";

export class UpdateBranchDTO {
  @IsString({ message: "O nome da filial deve ser uma string" })
  name: string;

  @IsString({ message: "O documento da filial deve ser uma string" })
  document: string;
}
