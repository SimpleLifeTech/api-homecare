import { Body, Controller, Delete, Get, Param, Post, Put, Res } from "@nestjs/common";
import { GlobalFunctions } from "@shared/shared/utils/functions";
import { Response } from "express";

import { CreatePersonDTO } from "./dto/create-person.dto";
import { UpdatePersonDTO } from "./dto/update-person.dto";
import { PersonService } from "./person.service";

const globalFunctions = new GlobalFunctions();

@Controller("person")
export class PersonController {
  constructor(protected readonly personService: PersonService) {}

  @Post("/create")
  async createPerson(@Body() data: CreatePersonDTO, @Res() res: Response) {
    const { codeHttp, ...response } = await this.personService.createPerson(data);

    return res.status(codeHttp).json(response);
  }

  @Get("/list/:personId")
  async listPerson(@Param("personId") personId: string, @Res() res: Response) {
    globalFunctions.IsEmptyParam(personId);

    const { codeHttp, ...response } = await this.personService.findPersonById(personId);

    return res.status(codeHttp).json(response);
  }

  @Put("/update/:personId")
  async updatePerson(
    @Param("personId") personId: string,
    @Body() data: UpdatePersonDTO,
    @Res() res: Response,
  ) {
    globalFunctions.IsEmptyParam(personId);

    const { codeHttp, ...response } = await this.personService.updatePersonById(personId, data);

    return res.status(codeHttp).json(response);
  }

  @Delete("/delete/:personId")
  async deletePerson(@Param("personId") personId: string, @Res() res: Response) {
    globalFunctions.IsEmptyParam(personId);

    const { codeHttp, ...response } = await this.personService.inactivatePersonById(personId);

    return res.status(codeHttp).json(response);
  }
}
