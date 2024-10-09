import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class PrivateDebitUserUsageDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  request: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  response: string
}
