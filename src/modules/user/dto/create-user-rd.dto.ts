import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateUserRdDto {
  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsString()
  phone: string

  @IsNotEmpty()
  @IsString()
  fluxo: string

  @IsString()
  @IsOptional()
  referral: string
}
