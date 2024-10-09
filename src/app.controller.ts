import { Controller, Get, HttpStatus, Res } from "@nestjs/common"
import { Response } from "express"

@Controller()
export class AppController {
  @Get()
  getRoot(@Res() res: Response): void {
    res.status(HttpStatus.OK).json({
      message: "API Home Care is running 🚀",
      time: new Date().toString(),
    })
  }
}
