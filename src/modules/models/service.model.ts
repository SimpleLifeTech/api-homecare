import { Service } from "@prisma/client";

export class ServiceModel implements Service {
  id: string;
  companyId: string;
  patientId: string;
  employeeId: string;
  title: string;
  description: string;
  startAt: Date;
  startTime: string;
  endAt: Date;
  endTime: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;

  constructor(partial: Partial<ServiceModel>) {
    Object.assign(this, partial);
  }
}
