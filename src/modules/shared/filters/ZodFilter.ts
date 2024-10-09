import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common"
import { ZodError, ZodIssue } from "zod"

@Catch(ZodError)
export class ZodFilter<T extends ZodError> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()

    response.status(400).json({
      errors: this.mapErrors(exception.errors),
      message: "Erro na validação dos dados",
      code: "ValidationError",
    })
  }

  mapErrors(issues: ZodIssue[]) {
    const output: Record<string, string[]> = {}
    for (const issue of issues) {
      const pathName = issue.path.join(".")
      if (pathName in output) {
        output[pathName].push(issue.message)
        continue
      }

      output[pathName] = [issue.message]
    }
    return output
  }
}
