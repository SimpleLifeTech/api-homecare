import { IsString } from "class-validator";

export class UpdateHomecareDTO {
  @IsString({ message: "O nome do homecare deve ser uma string" })
  name: string;

  @IsString({ message: "O endereço do homecare deve ser uma string" })
  address: string;

  @IsString({ message: "O numero do endereço do homecare deve ser uma string" })
  addressNumber: string;

  @IsString({ message: "O complemento do endereço do homecare deve ser uma string" })
  addressComplement: string;

  @IsString({ message: "A cidade do homecare deve ser uma string" })
  addressCity: string;

  @IsString({ message: "O estado do homecare deve ser uma string" })
  addressState: string;

  @IsString({ message: "O CEP do homecare deve ser uma string" })
  addressZipcode: string;
}
