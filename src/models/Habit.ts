import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import HabitChallenge from './HabitChallenge';
import HabitUser from './HabitUser';

@Entity('habits')
class Habit {
  @PrimaryColumn()
  readonly id: string;

  @OneToMany(() => HabitChallenge, (habitChallenge) => habitChallenge.habit, {
    cascade: true,
  })
  challenges: HabitChallenge[];

  @OneToMany(() => HabitUser, (habitUser) => habitUser.habit, {
    cascade: true,
  })
  habitsUsers: HabitUser[];

  @Column()
  icon: string;

  @Column()
  name: string;

  @Column()
  description: string;

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

export default Habit;
