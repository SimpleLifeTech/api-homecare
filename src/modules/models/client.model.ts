import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

import { PersonModel } from "./person.model";

@Entity()
export class ClientModel {
  @PrimaryColumn()
  id: string;

  @Column()
  person_id: string;

  @ManyToOne(() => PersonModel)
  @JoinColumn({ name: "person_id" })
  person: PersonModel;

  @Column()
  document: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
