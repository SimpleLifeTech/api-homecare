import { IsString } from "class-validator";

export class UpdateDepartmentDTO {
    @IsString({ message: "O nome do departamento deve ser uma string" })
    name: string
}