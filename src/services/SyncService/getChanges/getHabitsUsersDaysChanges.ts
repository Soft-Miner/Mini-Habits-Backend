import { getRepository } from 'typeorm';
import HabitUserDay from '../../../models/HabitUserDay';

export const getHabitsUsersDaysChanges = async (
  userId: string,
  lastPulletAt?: number
) => {
  const habitsUsersDaysRepository = getRepository(HabitUserDay);
  let habitsUsersDays: HabitUserDay[];

  if (lastPulletAt) {
    habitsUsersDays = await habitsUsersDaysRepository
      .createQueryBuilder('habits_users_days')
      .leftJoin('habits_users_days.habitUser', 'habits_users')
      .where(
        'habits_users.user_id = :userId AND habits_users_days.last_modified > :lastPulletAt',
        {
          lastPulletAt: new Date(lastPulletAt).toJSON(),
          userId,
        }
      )
      .getMany();
  } else {
    habitsUsersDays = await habitsUsersDaysRepository
      .createQueryBuilder('habits_users_days')
      .leftJoin('habits_users_days.habitUser', 'habits_users')
      .where('habits_users.user_id = :userId', {
        userId,
      })
      .getMany();
  }

  return habitsUsersDays;
};
