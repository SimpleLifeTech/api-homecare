import { IsEmail, IsNotEmpty } from "class-validator"

export class ResendConfirmEmailDto {
  @IsNotEmpty()
  @IsEmail()
  email: string
}
