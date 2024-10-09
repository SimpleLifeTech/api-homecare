import { ApiPropertyOptional } from "@nestjs/swagger"
import { IsDate, IsEmail, IsOptional, IsString } from "class-validator"

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  password?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  document?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  password_change_token?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  password_change_sent_at?: Date

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  email_change_token?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  email_change_sent_at?: Date

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  email_confirm_token?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  email_confirm_sent_at?: Date

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  confirmed_at?: Date

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  last_sign_in_at?: Date

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  image_url?: string

  planCredits?: number
  additionalCredits?: number
  stripeId?: string

  phoneConfirmedAt?: Date
}
