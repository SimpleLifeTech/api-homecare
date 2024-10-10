import { IsString } from "class-validator";

export class UpdateHomecareDTO {
  @IsString({ message: "O nome do homecare deve ser uma string" })
  name: string;

  @IsString({ message: "O endereço do homecare deve ser uma string" })
  address: string;

  @IsString({ message: "O numero do endereço do homecare deve ser uma string" })
  address_number: string;

  @IsString({ message: "O complemento do endereço do homecare deve ser uma string" })
  address_complement: string;

  @IsString({ message: "A cidade do homecare deve ser uma string" })
  address_city: string;

  @IsString({ message: "O estado do homecare deve ser uma string" })
  address_state: string;

  @IsString({ message: "O CEP do homecare deve ser uma string" })
  address_zipcode: string;
}
