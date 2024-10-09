import { Inject, Injectable, NestMiddleware } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { NextFunction, Request, Response } from "express"
import { IUserRepository } from "src/modules/user/implementations/user.repository"
import { UserPrismaRepository } from "src/modules/user/infra/prisma/user.prisma.repository"

@Injectable()
export class UserDeletedMiddleware implements NestMiddleware {
  constructor(
    @Inject(UserPrismaRepository)
    protected userRepository: IUserRepository,
    protected jwtService: JwtService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const userBearerToken = req?.headers?.authorization?.split(" ")

      if (userBearerToken) {
        const token = userBearerToken[1]
        const decodedToken = this.jwtService.decode(token)

        if (!decodedToken || !decodedToken.sub) {
          return res.status(401).json({ Error: "Token inválido" })
        }

        const userId = decodedToken.sub
        const user = await this.userRepository.findById(userId)

        if (user && user?.deleted_at) {
          return res.status(403).json({ Error: "Usuário deletado" })
        }
      }
      next()
    } catch (error) {
      console.error("Error:", error)
      return res.status(500).json({ Error: "Internal Server Error" })
    }
  }
}
