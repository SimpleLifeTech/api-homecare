import { Body, Controller, Post } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Public } from 'src/modules/shared/decorators'
import { AuthDto, PrivatePhoneAuthDto } from '../../dto/auth.dto'
import { IResponseLogin } from '../../types/response-login.type'
import { LoginWppService } from './wpplogin.service'

@ApiTags('User')
@Controller('auth')
export class LoginWppController {
  constructor(private loginService: LoginWppService) {}

  @ApiOperation({ summary: 'Realizar login do usuário pelo telefone ' })
  @ApiBody({
    type: AuthDto,
  })
  @Public()
  @Post('/wpplogin')
  async execute(@Body() auth_dto: PrivatePhoneAuthDto): Promise<IResponseLogin> {
    return await this.loginService.execute(auth_dto)
  }
}
