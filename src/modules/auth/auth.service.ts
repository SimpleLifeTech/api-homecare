import { CompanyRepository } from "@modules/company/dao/company.repository";
import { PersonRepository } from "@modules/person/dao/person.repository";
import { PersonPermissionRepository } from "@modules/person_permission/dao/person-permission.repository";
import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { GlobalFunctions } from "@shared/shared/utils/functions";
import * as bcrypt from "bcryptjs";

import { AuthRepository } from "./dao/auth.repository";
import { LoginDTO } from "./dto/login.dto";

const { blank, excludeFromObject, filled } = new GlobalFunctions();

@Injectable()
export class AuthService {
  constructor(
    @Inject(PersonRepository) protected readonly personRepository: PersonRepository,
    @Inject(PersonPermissionRepository)
    protected readonly personPermissionRepository: PersonPermissionRepository,
    @Inject(CompanyRepository) protected readonly companyRepository: CompanyRepository,
    @Inject(AuthRepository) protected readonly authRepository: AuthRepository,
  ) {}

  async login(data: LoginDTO) {
    const user = await this.personRepository.findPersonByEmail(data.email);

    if (blank(user) || filled(user.deletedAt))
      throw new BadRequestException("Usuário não encontrado.");

    const passwordMatches = bcrypt.compareSync(data.password, user.password);

    if (blank(passwordMatches)) throw new BadRequestException("Senha inválida.");

    const tokens = await this.authRepository.getTokens({
      userId: user.id,
      email: user.email,
    });

    const formatted = excludeFromObject(user, ["password"]);

    const company = await this.companyRepository.findCompanyByUserId(user.id);

    const permissions = await this.personPermissionRepository.findPermissionByPersonId(user.id);

    return {
      tokens,
      user: {
        ...formatted,
      },
      company: company || null,
      permissions,
    };
  }
}
