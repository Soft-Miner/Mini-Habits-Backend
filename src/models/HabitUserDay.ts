import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import HabitChallenge from './HabitChallenge';
import HabitUser from './HabitUser';

@Entity('habits_users_days')
class HabitUserDay {
  @PrimaryColumn()
  readonly id: string;

  @Column()
  habit_user_id: string;

  @ManyToOne(() => HabitUser, (habitUser) => habitUser.completedDays, {
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'habit_user_id' })
  habitUser: HabitUser;

  @Column()
  habit_challenge_id: string;

  @ManyToOne(
    () => HabitChallenge,
    (habitChallenge) => habitChallenge.habitsUsersDays,
    {
      orphanedRowAction: 'delete',
    }
  )
  @JoinColumn({ name: 'habit_challenge_id' })
  habitChallenge: HabitChallenge;

  @Column()
  completed_day: Date;

  @UpdateDateColumn()
  last_modified?: Date;

  @CreateDateColumn()
  created_at?: Date;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}

export default HabitUserDay;
