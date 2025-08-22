import { Planning } from "@prisma/client";

export class PlanningModel implements Planning {
  id: string;
  homecareId: string;
  month: string;
  year: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;

  constructor(partial: Partial<PlanningModel>) {
    Object.assign(this, partial);
  }
}
