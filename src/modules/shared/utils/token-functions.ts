import * as crypto from "node:crypto";

export function generateRandomToken(length: number): string {
  const token = crypto.randomBytes(length).toString("hex");
  return token;
}
