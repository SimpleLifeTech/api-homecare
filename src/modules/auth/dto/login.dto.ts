import { IsNotEmpty, IsString } from "class-validator";

export class LoginDTO {
  @IsString({ message: "O e-mail deve ser uma string" })
  @IsNotEmpty({ message: "O e-mail deve ser preenchido" })
  email: string;

  @IsString({ message: "A senha deve ser uma string" })
  @IsNotEmpty({ message: "A senha deve ser preenchida" })
  password: string;
}
