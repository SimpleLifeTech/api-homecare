export async function generateRandomHexString(length: number): Promise<string> {
  const characters = "0123456789abcdef" // Caracteres hexadecimais possíveis
  let result = ""

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    result += characters.charAt(randomIndex)
  }

  return result
}
