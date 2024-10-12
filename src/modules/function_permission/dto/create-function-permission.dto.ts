import { IsBoolean, IsNotEmpty } from "class-validator";

export class CreateFunctionPermissionDTO {
  @IsBoolean({ message: "A permissão deve ser uma boolean" })
  @IsNotEmpty({ message: "A permissão deve ser preenchida" })
  feed: boolean;

  @IsBoolean({ message: "A permissão de deletar deve ser uma boolean" })
  @IsNotEmpty({ message: "A permissão de deletar deve ser preenchida" })
  delete: boolean;
}
