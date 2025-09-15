import { Person } from "@modules/person/types/person.types";
import { Company, PersonPermission } from "@prisma/client";

export interface IResponseLogin {
  tokens: Tokens;
  user: Person;
  company: Company | null;
  permissions: PersonPermission[];
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
