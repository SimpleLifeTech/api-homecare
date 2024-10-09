import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { PassportStrategy } from "@nestjs/passport"
import { Request } from "express"
import { ExtractJwt, Strategy } from "passport-jwt"
import { JwtPayload } from "../types"
import { JwtPayloadWithRt } from "../types/jwt-payload-with-rt.type"
import { LoginRoles } from "../business/login.roles"

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>("RT_SECRET"),
      passReqToCallback: true,
    })
  }

  validate(req: Request, payload: JwtPayload): JwtPayloadWithRt {
    const errors = new LoginRoles()
    const refreshToken = req?.get("authorization")?.replace("Bearer", "").trim()

    errors.tokenError(refreshToken)

    return {
      ...payload,
      refreshToken,
    }
  }
}
