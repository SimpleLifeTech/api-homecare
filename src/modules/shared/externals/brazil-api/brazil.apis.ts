import axios from "axios";

import { BANK_RESPONSE, CEP_RESPONSE, CNPJ_RESPONSE } from "./brazil.types";
import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";

@Injectable()
export class BrazilAPI {
  constructor(private configService: ConfigService) {}

  private BRAZIL_API_URL = this.configService.get<string>("BRAZIL_API_URL");

  async getBanks() {
    return await axios.get<BANK_RESPONSE[]>(`${this.BRAZIL_API_URL}/banks/v1`);
  }

  async getCEP(cep: string) {
    return await axios.get<CEP_RESPONSE>(`${this.BRAZIL_API_URL}/cep/v2/${cep}`);
  }

  async getCNPJ(cnpj: string) {
    return await axios.get<CNPJ_RESPONSE>(`${this.BRAZIL_API_URL}/cnpj/v1/${cnpj}`);
  }
}
