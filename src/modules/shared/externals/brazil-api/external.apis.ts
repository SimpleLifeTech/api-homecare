import axios from "axios";

import { BANK_RESPONSE, CEP_RESPONSE, CNPJ_RESPONSE } from "./external.types";

export class ExternalAPIs {
  constructor(private readonly BRAZIL_API_URL = process.env.BRAZIL_API_URL) {}

  async getBanks() {
    return axios.get<BANK_RESPONSE[]>(`${this.BRAZIL_API_URL}/banks/v1`);
  }

  async getCEP(cep: string) {
    return axios.get<CEP_RESPONSE>(`${this.BRAZIL_API_URL}/cep/v2/${cep}`);
  }

  async getCNPJ(cnpj: string) {
    return axios.get<CNPJ_RESPONSE>(`${this.BRAZIL_API_URL}/cnpj/v1/${cnpj}`);
  }
}
