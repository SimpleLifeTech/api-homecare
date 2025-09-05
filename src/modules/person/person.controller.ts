import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { GlobalFunctions } from "@shared/shared/utils/functions";
import { Response } from "express";

import { CreatePersonDTO } from "./dto/create-person.dto";
import { UpdatePersonDTO } from "./dto/update-person.dto";
import { PersonService } from "./person.service";

const { IsEmptyParam } = new GlobalFunctions();

@Controller("person")
export class PersonController {
  constructor(protected readonly personService: PersonService) {}

  @Post("/create")
  @UseInterceptors(FileInterceptor("image"))
  async createPerson(
    @UploadedFile() image: Express.Multer.File,
    @Body() data: CreatePersonDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { codeHttp, ...response } = await this.personService.createPerson(data, image);

    res.status(codeHttp).json(response);
  }

  @Get("/list/:personId")
  async listPerson(@Param("personId") personId: string, @Res({ passthrough: true }) res: Response) {
    IsEmptyParam(personId);
    const { codeHttp, ...response } = await this.personService.findPersonById(personId);

    res.status(codeHttp).json(response);
  }

  @Put("/update/:personId")
  @UseInterceptors(FileInterceptor("image"))
  async updatePerson(
    @Param("personId") personId: string,
    @UploadedFile() image: Express.Multer.File,
    @Body() data: UpdatePersonDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    IsEmptyParam(personId);
    const { codeHttp, ...response } = await this.personService.updatePersonById(
      personId,
      data,
      image,
    );

    res.status(codeHttp).json(response);
  }

  @Delete("/delete/:personId")
  async deletePerson(
    @Param("personId") personId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    IsEmptyParam(personId);
    const { codeHttp, ...response } = await this.personService.inactivatePersonById(personId);

    res.status(codeHttp).json(response);
  }
}
