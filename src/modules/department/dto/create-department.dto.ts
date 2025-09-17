import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class CreateDepartmentDTO {
    @IsString({ message: "O id da filial deve ser uma string" })
    @IsNotEmpty({ message: "O id da filial deve ser preenchido" })
    branchId: string;

    @IsString({ message: "O nome do departamento deve ser uma string" })
    @IsNotEmpty({ message: "O nome do departamento deve ser preenchido" })
    name: string;

    @IsArray({ message: "O campo employees deve ser um array" })
    employees?: any[];
}