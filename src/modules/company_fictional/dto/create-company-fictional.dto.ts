import { CompanyType } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";

export class CreateCompanyFictionalDTO {
  @IsString({ message: "O ID da filial deve ser uma string" })
  @IsNotEmpty({ message: "O ID da filial deve ser preenchido" })
  branchId: string;

  @IsString({ message: "O ID da pessoa deve ser uma string" })
  @IsNotEmpty({ message: "O ID da pessoa deve ser preenchido" })
  personId: string;

  @IsEnum(CompanyType, { message: "O tipo da empresa é inválido" })
  @IsNotEmpty({ message: "O tipo da empresa deve ser preenchido" })
  type: CompanyType;

  @IsString({ message: "O nome da empresa deve ser uma string" })
  @IsNotEmpty({ message: "O nome da empresa deve ser preenchido" })
  name: string;
}
