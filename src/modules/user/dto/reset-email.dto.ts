import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class ResetEmailDto {
  @IsNotEmpty()
  @IsString()
  token: string

  @IsNotEmpty()
  @IsEmail()
  email: string
}
