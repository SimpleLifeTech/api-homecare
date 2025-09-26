import { CreatePersonDTO } from "@modules/person/dto/create-person.dto";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateEmployeeDto extends CreatePersonDTO {
  @IsString({ message: "O ID da filial deve ser uma string" })
  @IsNotEmpty({ message: "O ID da filial deve ser preenchido" })
  branchId: string;

  @IsString({ message: "A profissão deve ser uma string" })
  @IsNotEmpty({ message: "A profissão deve ser preenchida" })
  workRole: string;

  @IsString({ message: "A escala deve ser uma string" })
  @IsNotEmpty({ message: "A escala deve ser preenchida" })
  workShift: string;

  @IsString({ message: "O salário deve ser uma string" })
  @IsOptional()
  salary: number;
}
