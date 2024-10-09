import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateUserRdDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  phone: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  fluxo: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  referral: string
}
