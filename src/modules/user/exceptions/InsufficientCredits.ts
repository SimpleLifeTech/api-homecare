import { AppHttpException } from "@shared/shared/exceptions/AppHttpException"

export class InsufficientCredits extends AppHttpException {
  constructor() {
    super({
      message: "Créditos insuficientes",
      code: InsufficientCredits.name,
      error: {
        // Pra manter suporte ao legado
        message:
          "Este prompt excede a sua quantidade de palavras. Alavanque seu negócio com Sofia Resolve.",
        messageCode: "wordQuantityExceeded",
      },
    })
  }
}
