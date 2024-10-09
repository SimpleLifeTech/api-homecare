import { IsNotEmpty, IsString } from "class-validator"

export class PrivateDebitUserUsageDto {
  @IsNotEmpty()
  @IsString()
  request: string

  @IsNotEmpty()
  @IsString()
  response: string
}
