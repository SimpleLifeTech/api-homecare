import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("person")
export class PersonModel {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ select: false })
  password: string;

  @Column()
  document: string;

  @Column()
  image: string;

  @Column()
  phone: string;

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
