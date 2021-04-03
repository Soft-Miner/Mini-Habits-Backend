import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import HabitUser from './HabitUser';

@Entity('users')
class User {
  @PrimaryColumn()
  readonly id: string;

  @OneToMany(() => HabitUser, (habitUser) => habitUser.user, {
    cascade: true,
  })
  habits: HabitUser[];

  @Column()
  name: string;

  @Column()
  lastname: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  last_modified: Date;

  @CreateDateColumn()
  created_at: Date;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}

export default User;
