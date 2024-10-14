import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("branch")
export class BranchModel {
  @PrimaryColumn()
  id: string;

  @Column()
  company_id: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  address_number: string;

  @Column()
  address_complement: string;

  @Column()
  address_city: string;

  @Column()
  address_state: string;

  @Column()
  address_zipcode: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn({ select: false })
  updated_at: Date;

  @DeleteDateColumn({ select: false })
  deleted_at: Date;
}
