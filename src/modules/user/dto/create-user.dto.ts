import { IsDate, IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @IsString()
  password: string

  @IsNotEmpty()
  @IsString()
  name: string

  @IsOptional()
  @IsDate()
  confirmed_at: Date | null

  @IsOptional()
  @IsString()
  image_url?: string

  @IsOptional()
  @IsString()
  phone?: string

  @IsOptional()
  @IsString()
  stripeId: string

  @IsOptional()
  @IsString()
  referredCode?: string

  phoneConfirmedAt?: Date
  referredById?: string
}
