import { Body, Controller, Post } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Public } from 'src/modules/shared/decorators'
import { AuthDto } from '../../dto/auth.dto'
import { IResponseLogin } from '../../types/response-login.type'
import { LoginService } from './login.service'

@ApiTags('User')
@Controller('auth')
export class LoginController {
  constructor(private loginService: LoginService) {}

  @ApiOperation({ summary: 'Realizar login do usuário' })
  @ApiBody({
    type: AuthDto,
  })
  @Public()
  @Post('/login')
  async execute(@Body() auth_dto: AuthDto): Promise<IResponseLogin> {
    const data = await this.loginService.execute(auth_dto)

    return data
  }
}
