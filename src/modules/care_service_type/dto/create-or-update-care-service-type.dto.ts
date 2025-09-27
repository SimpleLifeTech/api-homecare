import { IsNotEmpty, IsString } from "class-validator";

export class CreateOrUpdateCareServiceTypeDTO {
  @IsString({ message: "O nome do tipo de cuidado deve ser uma string" })
  @IsNotEmpty({ message: "O nome do tipo de cuidado deve ser preenchido" })
  name: string;
}
