import { IsNotEmpty, IsString } from "class-validator";

export class CreateOrUpdateFunctionDTO {
  @IsString({ message: "O nome da função deve ser uma string" })
  @IsNotEmpty({ message: "O nome da função deve ser preenchido" })
  name: string;
}
