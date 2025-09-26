import { AllowanceCostOrigin } from "@prisma/client";
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
} from "class-validator";

export class CreatePatientDto {
  @IsOptional()
  @IsString({ message: "O nome do responsável deve ser uma string" })
  responsibleName: string;

  @IsOptional()
  @IsString({ message: "O e-mail do responsável deve ser uma string" })
  responsibleEmail: string;

  @IsOptional()
  @IsString({ message: "O telefone do responsável deve ser uma string" })
  responsiblePhone: string;

  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: "O campo escala deve ser um número" },
  )
  @IsPositive({ message: "O campo escala deve ser maior que zero" })
  @IsInt({ message: "O campo escala deve ser um número inteiro" })
  @Min(1, { message: "O campo escala deve ser maior que zero" })
  @Max(24, { message: "O campo escala deve ser menor ou igual a 24" })
  @IsNotEmpty({ message: "O campo escala deve ser preenchido" })
  requiredCareHours: number;

  @IsArray({ message: "O campo customFields deve ser um array" })
  @IsOptional()
  customFields: Array<{ key: string; value: string }>;

  @IsString({ message: "O campo notations deve ser uma string" })
  @IsOptional()
  notations: string;

  @IsEnum(AllowanceCostOrigin, { message: "O campo ajuda de custo está inválido" })
  allowanceCostOrigin: AllowanceCostOrigin;

  @IsNumber()
  @IsOptional()
  allowanceCostPrice: number;

  @IsString({ message: "O nome do usuário deve ser uma string" })
  @IsNotEmpty({ message: "O nome do usuário deve ser preenchido" })
  name: string;

  @IsString({ message: "O e-mail do usuário deve ser uma string" })
  @IsNotEmpty({ message: "O e-mail do usuário deve ser preenchido" })
  email: string;

  @IsString({ message: "A senha do usuário deve ser uma string" })
  @IsNotEmpty({ message: "A senha do usuário deve ser preenchido" })
  password: string;

  @IsString({ message: "A data de nascimento do usuário deve ser uma string" })
  @IsNotEmpty({ message: "A data de nascimento do usuário deve ser preenchida" })
  birthdate: string;

  @IsString({ message: "O CPF do usuário deve ser uma string" })
  @IsNotEmpty({ message: "O CPF do usuário deve ser preenchido" })
  document: string;

  @IsString({ message: "O número de telefone/celular do usuário deve ser uma string" })
  @IsNotEmpty({ message: "O número de telefone/celular do usuário deve ser preenchido" })
  phone: string;

  @IsString({ message: "O endereço do usuário deve ser uma string" })
  @IsNotEmpty({ message: "O endereço do usuário deve ser preenchida" })
  address: string;

  @IsString({ message: "O numero do endereço do usuário deve ser uma string" })
  @IsNotEmpty({ message: "O numero do endereço do usuário deve ser preenchido" })
  addressNumber: string;

  @IsString({ message: "O complemento do endereço do usuário deve ser uma string" })
  addressComplement: string;

  @IsString({ message: "A cidade do usuário deve ser uma string" })
  @IsNotEmpty({ message: "A cidade do usuário deve ser preenchido" })
  addressCity: string;

  @IsString({ message: "O estado do usuário deve ser uma string" })
  @IsNotEmpty({ message: "O estado do usuário deve ser preenchido" })
  addressState: string;

  @IsString({ message: "O CEP do usuário deve ser uma string" })
  @IsNotEmpty({ message: "O CEP do usuário deve ser preenchido" })
  addressZipcode: string;
}
