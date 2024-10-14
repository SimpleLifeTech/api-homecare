import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

import { PersonModel } from "./person.model";

@Entity()
export class EmployeeModel {
  @PrimaryColumn()
  id: string;

  @Column()
  person_id: string;

  @OneToOne(() => PersonModel)
  @JoinColumn({ name: "person_id" })
  person: PersonModel;

  @Column()
  work_function: string;

  @Column()
  document: string;

  @Column()
  salary: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
