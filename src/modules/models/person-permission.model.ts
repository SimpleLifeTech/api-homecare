import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("person_permission")
export class PersonPermissionModel {
  @PrimaryColumn()
  id: string;

  @Column()
  person_id: string;

  @Column()
  function_permission_id: string;

  @Column()
  feed: boolean;

  @Column()
  delete: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn({ select: false })
  updated_at: Date;

  @DeleteDateColumn({ select: false })
  deleted_at: Date;
}
