import { ApiPropertyOptional } from "@nestjs/swagger"
import { IsOptional, IsString } from "class-validator"

export class PhoneConfirmationDto {
  @ApiPropertyOptional()
  @IsString()
  code: string

  @IsString()
  @IsOptional()
  userId: string
}
