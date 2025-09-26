import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { GlobalFunctions } from '@shared/shared/utils/functions';

import { CreatePersonDTO } from './dto/create-person.dto';
import { UpdatePersonDTO } from './dto/update-person.dto';
import { PersonService } from './person.service';

const { IsEmptyParam } = new GlobalFunctions();

@Controller("person")
export class PersonController {
  constructor(protected readonly personService: PersonService) {}

  @Post("/create")
  async createPerson(@Body() data: CreatePersonDTO) {
    return this.personService.createPerson(data, true);
  }

  @Get("/list/:personId")
  async listPerson(@Param("personId") personId: string) {
    IsEmptyParam(personId);
    return this.personService.findPersonById(personId);
  }

  @Put("/update/:personId")
  async updatePerson(
    @Param("personId") personId: string,
    @Body() data: UpdatePersonDTO,
  ) {
    IsEmptyParam(personId);
    return this.personService.updatePersonById(personId, data);
  }

  @Delete("/delete/:personId")
  async deletePerson(@Param("personId") personId: string) {
    IsEmptyParam(personId);
    return this.personService.inactivatePersonById(personId);
  }
}
