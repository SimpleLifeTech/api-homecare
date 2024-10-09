import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm"

@Entity()
export class EnterpriseModel {
  @PrimaryColumn()
  id: string

  @Column()
  name: string

  @Column()
  image: string

  @Column()
  document: string

  @Column()
  address: string

  @Column()
  address_number: string

  @Column()
  address_complement: string

  @Column()
  address_city: string

  @Column()
  address_state: string

  @Column()
  address_zipcode: string

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @DeleteDateColumn()
  deleted_at: Date
}
