import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user.entity";

type userGender = "male" | "female";

@Entity()
export class Profile extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  mobileNumber: string;

  @Column({
    type: "enum",
    enum: ["male", "female"],
    default: "male",
  })
  gender: userGender;

  @OneToOne(() => User, (user) => user.profile)
  user: User;
}
