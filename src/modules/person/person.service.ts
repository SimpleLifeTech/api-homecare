import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CacheRepository } from '@shared/shared/cache/cache.repository';
import { GlobalFunctions } from '@shared/shared/utils/functions';
import * as bcrypt from 'bcryptjs';

import { PersonRepository } from './dao/person.repository';
import { CreatePersonDTO } from './dto/create-person.dto';
import { UpdatePersonDTO } from './dto/update-person.dto';
import { Person } from './types/person.types';

const { blank, filled, removeSpecialCharacters, excludeFromObject } = new GlobalFunctions();

@Injectable()
export class PersonService {
  constructor(
    @Inject(PersonRepository) protected readonly personRepository: PersonRepository,
    private readonly cache: CacheRepository,
  ) {}

  async createPerson(data: CreatePersonDTO, file?: Express.Multer.File) {
    const personExists = await this.personRepository.findPersonByDocument(data.document);

    if (filled(personExists)) throw new BadRequestException("Pessoa já cadastrada");

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(data.password, salt);

    if (blank(hashedPassword)) throw new BadRequestException("Senha não criada");

    const user = {
      ...data,
      password: hashedPassword,
      document: removeSpecialCharacters(data.document),
      addressZipcode: removeSpecialCharacters(data.addressZipcode),
    };

    await this.personRepository.createPerson(user, file);

    return "Pessoa criada com sucesso!";
  }

  async findPersonById(personId: string) {
    return await this.getPersonById(personId);
  }

  async updatePersonById(personId: string, data: UpdatePersonDTO, file?: Express.Multer.File) {
    await this.getPersonById(personId);
    await this.personRepository.updatePersonById(personId, data, file);
    await this.cache.del(this.cacheKey(personId));
    return "Pessoa atualizada com sucesso!";
  }

  async inactivatePersonById(personId: string) {
    await this.getPersonById(personId);
    await this.personRepository.inactivatePersonById(personId);
    await this.cache.del(this.cacheKey(personId));
    return "Pessoa inativada com sucesso!";
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
