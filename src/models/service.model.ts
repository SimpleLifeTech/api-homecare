import {
    Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserModel } from './user.model';
import { ClientModel } from './client.model';
import { EmployeeModel } from './employee.model';
import { EnterpriseModel } from './enterprise.model';

@Entity()
export class ServiceModel {
  @PrimaryColumn()
  id: string;

  @Column()
  enterprise_id: string;

  @ManyToOne(() => EnterpriseModel)
  @JoinColumn({ name: 'enterprise_id' })
  enterprise: EnterpriseModel;

  @Column()
  employee_id: string;
  
  @ManyToOne(() => EmployeeModel)
  @JoinColumn({ name: 'employee_id' })
  employee: EmployeeModel;

  @Column()
  client_id: string;

  @ManyToOne(() => ClientModel)
  @JoinColumn({ name: 'client_id' })
  client: ClientModel;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  start_at: Date;

  @Column()
  start_time: string;

  @Column()
  end_at: Date;

  @Column()
  end_time: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
