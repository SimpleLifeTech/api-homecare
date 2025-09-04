import { Patient } from "@prisma/client";

export class PatientModel implements Patient {
  id: string;
  personId: string;
  responsibleName: string;
  responsibleEmail: string;
  responsiblePhone: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;

  constructor(partial: Partial<PatientModel>) {
    Object.assign(this, partial);
  }
}
