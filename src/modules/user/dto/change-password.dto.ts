import { ApiPropertyOptional } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class ChangePasswordDto {
  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  old_password: string
  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  new_password: string
}
