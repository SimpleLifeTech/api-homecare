import { ApiProperty } from "@nestjs/swagger"
import { IsDate, IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty()
  @IsOptional()
  @IsDate()
  confirmed_at: Date | null

  @ApiProperty()
  @IsOptional()
  @IsString()
  image_url?: string

  @ApiProperty()
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
