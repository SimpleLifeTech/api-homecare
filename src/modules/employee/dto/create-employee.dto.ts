import { CreatePersonDTO } from "@modules/person/dto/create-person.dto";
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Max, Min } from "class-validator";

export class CreateEmployeeDto extends CreatePersonDTO {
  @IsString({ message: "O ID da filial deve ser uma string" })
  @IsNotEmpty({ message: "O ID da filial deve ser preenchido" })
  branchId: string;

  @IsString({ message: "A profissão deve ser uma string" })
  @IsNotEmpty({ message: "A profissão deve ser preenchida" })
  workRole: string;

  @IsNumber({ allowInfinity: false, allowNaN: false }, { message: "A quantidade de horas que o funcionário irá cumprir deve ser um número" })
  @IsPositive({ message: "A quantidade de horas que o funcionário irá cumprir deve ser maior que zero" })
  @IsInt({ message: "A quantidade de horas que o funcionário irá cumprir deve ser um número inteiro" })
  @Min(1, { message: "A quantidade de horas que o funcionário irá cumprir deve ser maior que zero" })
  @Max(24, { message: "A quantidade de horas que o funcionário irá cumprir deve ser menor ou igual a 24" })
  @IsNotEmpty({ message: "A quantidade de horas que o funcionário irá cumprir deve ser preenchida" })
  workTime: number;

  
  @IsNumber({ allowInfinity: false, allowNaN: false }, { message: "A quantidade de horas que o funcionário irá folgar deve ser um número" })
  @IsPositive({ message: "A quantidade de horas que o funcionário irá folgar deve ser maior que zero" })
  @IsInt({ message: "A quantidade de horas que o funcionário irá folgar deve ser um número inteiro" })
  @Min(1, { message: "A quantidade de horas que o funcionário irá folgar deve ser maior que zero" })
  @IsNotEmpty({ message: "A escala deve ser preenchida" })
  dayOffTime: number;
}
