import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class UserModel {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ select: false })
  password: string;

  @Column()
  role: string;

  @Column()
  phone: string;
  
  @Column()
  city: string;
  
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

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
