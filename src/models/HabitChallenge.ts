import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import Habit from './Habit';
import HabitUser from './HabitUser';
import HabitUserDay from './HabitUserDay';

@Entity('habits_challenges')
class HabitChallenge {
  @PrimaryColumn()
  readonly id: string;

  @Column()
  habits_id: string;

  @ManyToOne(() => Habit, (habit) => habit.challenges, {
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'habits_id' })
  habit: Habit;

  @OneToMany(() => HabitUser, (habitUser) => habitUser.habitChallenge, {
    cascade: true,
  })
  habitsUsers: HabitUser[];

  @OneToMany(
    () => HabitUserDay,
    (habitUserDay) => habitUserDay.habitChallenge,
    {
      cascade: true,
    }
  )
  habitsUsersDays: HabitUserDay[];

  @Column()
  level: number;

  @Column()
  description: string;

  @Column()
  icon: string;

  @Column()
  xp_reward: number;

  @UpdateDateColumn()
  last_modified: Date;

  @CreateDateColumn()
  created_at: Date;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}

export default HabitChallenge;
