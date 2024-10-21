import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { APIResponse, CoreResponse, ErrorTypes } from "@shared/shared/utils/response";
import * as bcrypt from "bcryptjs";

import { AuthRoles } from "./business/auth.roles";
import { PersonRepository } from "@modules/person/dao/person.repository";
import { AuthRepository } from "./dao/auth.repository";
import { LoginDTO } from "./dto/login.dto";
import { Person } from "@modules/person/types/person.types";
import { IResponseLogin } from "./types/auth.type";

const response = new CoreResponse();

@Injectable()
export class AuthService extends AuthRoles {
  constructor(
    @Inject(PersonRepository) protected readonly personRepository: PersonRepository,
    @Inject(AuthRepository) protected readonly authRepository: AuthRepository,
  ) {
    super();
  }

  async login(data: LoginDTO): Promise<APIResponse<IResponseLogin, ErrorTypes>> {
    const user = await this.personRepository.findPersonByEmail(data.email);

    await this.checkUser(user);

    this.checkPassword(user.password, data.password);

    const tokens = await this.authRepository.getTokens({
      userId: user.id,
      email: user.email,
    });

    return response.success({ tokens }, HttpStatus.OK);
  }

  async checkUser(user: Person) {
    await this.userNotFind(user?.id);
    await this.userDeleted(user?.deleted_at);
  }

  async checkPassword(hashedPassword: string, plainPassword: string) {
    const passwordMatches = bcrypt.compareSync(plainPassword, hashedPassword);

    await this.loginError(passwordMatches);
  }
}
