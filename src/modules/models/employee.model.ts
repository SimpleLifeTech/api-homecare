import { Employee } from "@prisma/client";

export class EmployeeModel implements Employee {
  id: string;
  personId: string;
  branchId: string;
  workRole: string;
  document: string;
  salary: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;

  constructor(partial: Partial<EmployeeModel>) {
    Object.assign(this, partial);
  }
}
