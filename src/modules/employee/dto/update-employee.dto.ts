import { UpdatePersonDTO } from "@modules/person/dto/update-person.dto";
import { IsInt, IsNotEmpty, IsNumber, IsPositive, IsString, Max, Min } from "class-validator";

export class UpdateEmployeeDto extends UpdatePersonDTO {
  @IsString({ message: "O ID da filial deve ser uma string" })
  @IsNotEmpty({ message: "O ID da filial deve ser preenchido" })
  branchId: string;

  @IsString({ message: "O ID da pessoa deve ser uma string" })
  @IsNotEmpty({ message: "O ID da pessoa deve ser preenchido" })
  personId: string;

  @IsString({ message: "O ID da profissão deve ser uma string" })
  @IsNotEmpty({ message: "O ID da profissão deve ser preenchida" })
  workRoleId: string;

  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: "A quantidade de horas que o funcionário irá cumprir deve ser um número" },
  )
  @IsPositive({
    message: "A quantidade de horas que o funcionário irá cumprir deve ser maior que zero",
  })
  @IsInt({
    message: "A quantidade de horas que o funcionário irá cumprir deve ser um número inteiro",
  })
  @Min(1, {
    message: "A quantidade de horas que o funcionário irá cumprir deve ser maior que zero",
  })
  @Max(24, {
    message: "A quantidade de horas que o funcionário irá cumprir deve ser menor ou igual a 24",
  })
  @IsNotEmpty({
    message: "A quantidade de horas que o funcionário irá cumprir deve ser preenchida",
  })
  workTime: number;

  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: "A quantidade de horas que o funcionário irá folgar deve ser um número" },
  )
  @IsPositive({
    message: "A quantidade de horas que o funcionário irá folgar deve ser maior que zero",
  })
  @IsInt({
    message: "A quantidade de horas que o funcionário irá folgar deve ser um número inteiro",
  })
  @Min(1, { message: "A quantidade de horas que o funcionário irá folgar deve ser maior que zero" })
  @IsNotEmpty({ message: "A escala deve ser preenchida" })
  dayOffTime: number;
}
