import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { GlobalFunctions } from "@shared/shared/utils/functions";

import { CreatePersonDTO } from "./dto/create-person.dto";
import { UpdatePersonDTO } from "./dto/update-person.dto";
import { PersonService } from "./person.service";

const { IsEmptyParam } = new GlobalFunctions();

@Controller("person")
export class PersonController {
  constructor(protected readonly personService: PersonService) {}

  @Post("/create")
  @UseInterceptors(FileInterceptor("image"))
  async createPerson(@UploadedFile() image: Express.Multer.File, @Body() data: CreatePersonDTO) {
    return this.personService.createPerson(data, image);
  }

  @Get("/list/:personId")
  async listPerson(@Param("personId") personId: string) {
    IsEmptyParam(personId);
    return this.personService.findPersonById(personId);
  }

  @Put("/update/:personId")
  @UseInterceptors(FileInterceptor("image"))
  async updatePerson(
    @Param("personId") personId: string,
    @UploadedFile() image: Express.Multer.File,
    @Body() data: UpdatePersonDTO,
  ) {
    IsEmptyParam(personId);
    return this.personService.updatePersonById(personId, data, image);
  }

  @Delete("/delete/:personId")
  async deletePerson(@Param("personId") personId: string) {
    IsEmptyParam(personId);
    return this.personService.inactivatePersonById(personId);
  }
}
