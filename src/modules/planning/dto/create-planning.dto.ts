import { IsNotEmpty, IsString, IsNumber, IsPositive, IsInt, Max, Min } from "class-validator";

export class CreatePlanningDTO {
  @IsString({ message: "O ID da homecare deve ser uma string" })
  @IsNotEmpty({ message: "O ID da homecare deve ser preenchido" })
  homecareId: string;

  @IsString({ message: "O nome da escala deve ser uma string" })
  @IsNotEmpty({ message: "O nome da escala deve ser preenchido" })
  name: string;

  @IsNumber({ allowInfinity: false, allowNaN: false})
  @IsPositive({ message: "O mês deve ser um número positivo"})
  @IsInt({ message: "O mês deve ser um número inteiro"})
  @Min(1, { message: "O valor mínimo é 1"})
  @Max(12, { message: "O valor máximo é 12"})
  @IsNotEmpty({ message: "O mês da escala deve ser preenchido"})
  month: number;

  @IsNumber({ allowInfinity: false, allowNaN: false})
  @IsPositive({ message: "O mês deve ser um número positivo"})
  @IsInt({ message: "O mês deve ser um número inteiro"})
  @Max(new Date().getFullYear(), { message: `O valor máximo é ${new Date().getFullYear()}`})
  @IsNotEmpty({ message: "O ano da escala deve ser preenchido"})
  year: number;

  @IsString({ message: "O tipo de serviço deve ser uma string" })
  @IsNotEmpty({ message: "O tipo de serviço deve ser preenchido" })
  careServiceType: string
}
