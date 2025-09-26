import { IsInt, IsNumber, IsOptional, IsPositive, IsString, Max, Min } from "class-validator";

export class UpdatePatientDto {
  @IsOptional()
  @IsString({ message: "O nome do responsável deve ser uma string" })
  responsibleName?: string;

  @IsOptional()
  @IsString({ message: "O e-mail do responsável deve ser uma string" })
  responsibleEmail?: string;

  @IsOptional()
  @IsString({ message: "O telefone do responsável deve ser uma string" })
  responsiblePhone?: string;

  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: "O campo escala deve ser um número" },
  )
  @IsPositive({ message: "O campo escala deve ser maior que zero" })
  @IsInt({ message: "O campo escala deve ser um número inteiro" })
  @Min(1, { message: "O campo escala deve ser maior que zero" })
  @Max(24, { message: "O campo escala deve ser menor ou igual a 24" })
  @IsOptional()
  requiredCareHours: number;

  @IsString({ message: "O nome do usuário deve ser uma string" })
  @IsOptional()
  name: string;

  @IsString({ message: "O e-mail do usuário deve ser uma string" })
  @IsOptional()
  email: string;

  @IsString({ message: "A senha do usuário deve ser uma string" })
  @IsOptional()
  password: string;

  @IsString({ message: "O CPF do usuário deve ser uma string" })
  @IsOptional()
  document: string;

  @IsString({ message: "O número de telefone/celular do usuário deve ser uma string" })
  @IsOptional()
  phone: string;

  @IsString({ message: "O endereço do usuário deve ser uma string" })
  @IsOptional()
  address: string;

  @IsString({ message: "O numero do endereço do usuário deve ser uma string" })
  @IsOptional()
  addressNumber: string;

  @IsString({ message: "O complemento do endereço do usuário deve ser uma string" })
  addressComplement: string;

  @IsString({ message: "A cidade do usuário deve ser uma string" })
  @IsOptional()
  addressCity: string;

  @IsString({ message: "O estado do usuário deve ser uma string" })
  @IsOptional()
  addressState: string;

  @IsString({ message: "O CEP do usuário deve ser uma string" })
  @IsOptional()
  addressZipcode: string;
}
