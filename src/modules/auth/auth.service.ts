import { PersonRepository } from "@modules/person/dao/person.repository";
import { Person } from "@modules/person/types/person.types";
import { PersonPermissionRepository } from "@modules/person_permission/dao/person-permission.repository";
import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { GlobalFunctions } from "@shared/shared/utils/functions";
import { APIResponse, CoreResponse, ErrorTypes } from "@shared/shared/utils/response";
import * as bcrypt from "bcryptjs";

import { AuthRoles } from "./business/auth.roles";
import { AuthRepository } from "./dao/auth.repository";
import { LoginDTO } from "./dto/login.dto";
import { IResponseLogin } from "./types/auth.type";
import { CompanyRepository } from "@modules/company/dao/company.repository";

const response = new CoreResponse();
const globalFunctions = new GlobalFunctions();

@Injectable()
export class AuthService extends AuthRoles {
  constructor(
    @Inject(PersonRepository) protected readonly personRepository: PersonRepository,
    @Inject(PersonPermissionRepository)
    protected readonly personPermissionRepository: PersonPermissionRepository,
    @Inject(CompanyRepository) protected readonly companyRepository: CompanyRepository,
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

    const formatted = globalFunctions.excludeFromObject(user, ["password"]);

    const company = await this.companyRepository.findCompanyByUserId(user.id);

    const permissions = await this.personPermissionRepository.findPermissionByPersonId(user.id);

    const final = {
      tokens,
      user: {
        ...formatted,
      },
      company: company || null,
      permissions,
    };

    return response.success(final, HttpStatus.OK);
  }

  async checkUser(user: Person) {
    await this.userNotFind(user?.id);
    await this.userDeleted(user?.deletedAt);
  }

  async checkPassword(hashedPassword: string, plainPassword: string) {
    const passwordMatches = bcrypt.compareSync(plainPassword, hashedPassword);

    await this.loginError(passwordMatches);
  }
}
