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

  
  person_id: string;

  
  name: string;

  
  image: string;

  
  document: string;

  
  created_at: Date;

  
  updated_at: Date;

  
  deleted_at: Date;
}
