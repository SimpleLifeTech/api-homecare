import { is } from "date-fns/locale"
import { UserEntity } from "src/modules/user/entities/user.entity"
import { Tokens } from "./tokens.type"
import { IUserWordsEntity } from "src/modules/user/types/iuser-words-type"

export interface IResponseLogin {
  tokens: Tokens
}
