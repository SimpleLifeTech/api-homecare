import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { CacheRepository } from "@shared/shared/cache/cache.repository";
import { GlobalFunctions } from "@shared/shared/utils/functions";
import * as bcrypt from "bcryptjs";
import slugify from "slugify";

import { PersonRepository } from "./dao/person.repository";
import { CreatePersonDTO } from "./dto/create-person.dto";
import { UpdatePersonDTO } from "./dto/update-person.dto";
import { Person } from "./types/person.types";

const { blank, filled, removeSpecialCharacters, excludeFromObject } = new GlobalFunctions();

@Injectable()
export class PersonService {
  constructor(
    @Inject(PersonRepository) protected readonly personRepository: PersonRepository,
    private readonly cache: CacheRepository,
  ) {}

  async createPerson(data: CreatePersonDTO, isFromLogin = false) {
    if (isFromLogin) {
      const personExists = await this.getPersonByDocument(data.document);
      if (filled(personExists)) throw new BadRequestException("Pessoa já cadastrada");
    }

    const email = isFromLogin
      ? data.email
      : `${slugify(data.name.split(" ")[0], { lower: true, strict: true })}${data.document}@email.com`;
    const password = isFromLogin ? data.password : (process.env.USER_PASSWORD_DEFAULT as string);

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    if (blank(hashedPassword)) throw new BadRequestException("Senha não criada");

    const user = {
      ...data,
      birthdate: new Date(data.birthdate),
      email,
      password: hashedPassword,
      document: removeSpecialCharacters(data.document),
      addressZipcode: removeSpecialCharacters(data.addressZipcode),
    };

    const person = await this.personRepository.createPerson(user);
    const formatedPerson = excludeFromObject(person, ["password"]);
    return isFromLogin ? "Pessoa criada com sucesso!" : formatedPerson;
  }

  async findPersonById(personId: string) {
    return await this.getPersonById(personId);
  }

  async updatePersonById(personId: string, data: UpdatePersonDTO) {
    await this.getPersonById(personId);
    await this.personRepository.updatePersonById(personId, data);
    await this.cache.del(this.cacheKey(personId));
    return "Pessoa atualizada com sucesso!";
  }

  async inactivatePersonById(personId: string) {
    await this.getPersonById(personId);
    await this.personRepository.inactivatePersonById(personId);
    await this.cache.del(this.cacheKey(personId));
    return "Pessoa inativada com sucesso!";
  }

  async getPersonByDocument(document: string): Promise<Person> {
    const cleanDocument = removeSpecialCharacters(document);
    const cacheKey = this.cacheKey(cleanDocument);
    const cachedPerson = await this.cache.get<Person>(cacheKey);

    if (filled(cachedPerson)) return cachedPerson;
    const person = await this.personRepository.findPersonByDocument(cleanDocument);

    if (blank(person)) throw new BadRequestException("Pessoa não encontrada");

    const formatedPerson = excludeFromObject(person, ["password"]);
    await this.cache.set(cacheKey, formatedPerson);
    return person;
  }

  private async getPersonById(personId: string): Promise<Person> {
    const cachedPerson = await this.cache.get(this.cacheKey(personId));

    if (filled(cachedPerson)) return cachedPerson as Person;

    const person = await this.personRepository.findPersonById(personId);

    if (blank(person)) throw new BadRequestException("Pessoa não encontrada");

    const formatedPerson = excludeFromObject(person, ["password"]);
    await this.cache.set(this.cacheKey(personId), formatedPerson);
    return person;
  }

  private cacheKey(personId: string) {
    return `person:${personId}`;
  }
}
