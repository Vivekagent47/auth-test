import {
  Entity,
  Column,
  Unique,
  BeforeInsert,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToOne,
  JoinColumn,
} from "typeorm";
import * as bcrypt from "bcryptjs";
import { Profile } from "./profile.entity";

type userType = "customer" | "consumer";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Unique("email", ["email"])
  @Column({ length: 320, nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({
    type: "enum",
    enum: ["customer", "consumer"],
    default: "customer",
  })
  userType: userType;

  @Column({ default: true })
  isActive: boolean;

  @OneToOne(() => Profile, (profile) => profile.user, { cascade: true })
  @JoinColumn()
  profile: Profile;

  @BeforeInsert()
  async hashPassword() {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
