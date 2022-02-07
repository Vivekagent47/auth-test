import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { KYC } from './kyc.entity';

@Entity()
export class AcceptedCompany {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => KYC)
  @JoinColumn()
  company: KYC;
}
