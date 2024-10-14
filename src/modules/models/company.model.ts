import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("company")
export class CompanyModel {
  @PrimaryColumn()
  id: string;

  @Column()
  person_id: string;

  @Column()
  name: string;

  @Column()
  image: string;

  @Column()
  document: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn({ select: false })
  updated_at: Date;

  @DeleteDateColumn({ select: false })
  deleted_at: Date;
}
