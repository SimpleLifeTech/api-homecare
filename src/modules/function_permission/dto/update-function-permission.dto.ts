import { IsBoolean } from "class-validator";

export class UpdateFunctionPermissionDTO {
  @IsBoolean({ message: "A permissão deve ser uma boolean" })
  feed: boolean;

  @IsBoolean({ message: "A permissão de deletar deve ser uma boolean" })
  delete: boolean;
}
