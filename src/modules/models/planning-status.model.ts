import { PlanningStatus } from "@prisma/client";

export class PlanningStatusModel implements PlanningStatus {
  id: string;
  planningId: string;
  name: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;

  constructor(partial: Partial<PlanningStatusModel>) {
    Object.assign(this, partial);
  }
}
