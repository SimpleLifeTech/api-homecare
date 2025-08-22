import { CompanyModel } from "@modules/models/company.model";
import { PersonPermissionModel } from "@modules/models/person-permission.model";
import { Person } from "@modules/person/types/person.types";

export interface IResponseLogin {
  tokens: Tokens;
  user: Person;
  company: CompanyModel | null;
  permissions: PersonPermissionModel[];
}

export type GenTokenPayload = { userId: string; email: string };

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export type JwtPayload = {
  sub: string;
  email?: string;
};
