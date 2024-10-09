import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty } from "class-validator"

export class ResendConfirmEmailDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string
}
