import { IsNotEmpty, IsString } from "class-validator";

export class AddOrUpdateEmployeeDepartmentDTO {
    @IsString({ message: "O ID do funcionário deve ser uma string" })
    @IsNotEmpty({ message: "O ID do funcionário deve ser preenchido" })
    employeeId: string;

    @IsString({ message: "O ID do departamento deve ser uma string" })
    @IsNotEmpty({ message: "O ID do departamento deve ser preenchido" })
    departmentId: string;

    @IsString({ message: "A feature deve ser uma string" })
    @IsNotEmpty({ message: "A feature deve ser preenchida" })
    feature: string;
}