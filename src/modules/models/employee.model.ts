import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm"

import { UserModel } from "./user.model"

@Entity()
export class EmployeeModel {
  @PrimaryColumn()
  id: string

  @Column()
  user_id: string

  @OneToOne(() => UserModel)
  @JoinColumn({ name: "user_id" })
  user: UserModel

  @Column()
  work_function: string

  @Column()
  document: string

  @Column()
  salary: number

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @DeleteDateColumn()
  deleted_at: Date
}
