import { Patient } from "@prisma/client";

export class PatientModel implements Patient {
  id: string;
  homecareId: string;
  personId: string;
  complexity: string;
  careHour: string;
  carePrice: number;
  careExpiresAt: Date;
  document: string;
  observation: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;

  constructor(partial: Partial<PatientModel>) {
    Object.assign(this, partial);
  }
}
