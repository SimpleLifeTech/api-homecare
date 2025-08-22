import { IsNotEmpty, IsString } from "class-validator";

export class CreateHomecareDTO {
  @IsString({ message: "O nome do homecare deve ser uma string" })
  @IsNotEmpty({ message: "O nome do homecare deve ser preenchido" })
  name: string;

  @IsString({ message: "O endereço do homecare deve ser uma string" })
  @IsNotEmpty({ message: "O endereço do homecare deve ser preenchida" })
  address: string;

  @IsString({ message: "O numero do endereço do homecare deve ser uma string" })
  @IsNotEmpty({ message: "O numero do endereço do homecare deve ser preenchido" })
  addressNumber: string;

  @IsString({ message: "O complemento do endereço do homecare deve ser uma string" })
  addressComplement: string;

  @IsString({ message: "A cidade do homecare deve ser uma string" })
  @IsNotEmpty({ message: "A cidade do homecare deve ser preenchido" })
  addressCity: string;

  @IsString({ message: "O estado do homecare deve ser uma string" })
  @IsNotEmpty({ message: "O estado do homecare deve ser preenchido" })
  addressState: string;

  @IsString({ message: "O CEP do homecare deve ser uma string" })
  @IsNotEmpty({ message: "O CEP do homecare deve ser preenchido" })
  addressZipcode: string;
}
