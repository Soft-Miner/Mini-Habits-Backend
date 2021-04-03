import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import Habit from './Habit';
import HabitChallenge from './HabitChallenge';
import HabitUserDay from './HabitUserDay';
import User from './User';

@Entity('habits_users')
class HabitUser {
  @PrimaryColumn()
  readonly id: string;

  @Column()
  user_id: string;

  @OneToMany(() => HabitUserDay, (habitUserDay) => habitUserDay.habitUser, {
    cascade: true,
  })
  completedDays: HabitUserDay[];

  @ManyToOne(() => User, (user) => user.habits, {
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  habit_id: string;

  @ManyToOne(() => Habit, (habit) => habit.habitsUsers, {
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'habit_id' })
  habit: Habit;

  @Column()
  habit_challenge_id: string;

  @ManyToOne(
    () => HabitChallenge,
    (habitChallenge) => habitChallenge.habitsUsers,
    {
      orphanedRowAction: 'delete',
    }
  )
  @JoinColumn({ name: 'habit_challenge_id' })
  habitChallenge: HabitChallenge;

  @Column()
  experience: number;

  @Column()
  time_sunday: number;

  @Column()
  time_monday: number;

  @Column()
  time_tuesday: number;

  @Column()
  time_wednesday: number;

  @Column()
  time_thursday: number;

  @Column()
  time_friday: number;

  @Column()
  time_saturday: number;

  @Column()
  deleted: boolean;

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

export default HabitUser;
