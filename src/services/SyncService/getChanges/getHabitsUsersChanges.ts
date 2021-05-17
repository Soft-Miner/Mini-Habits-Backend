import { getRepository, MoreThan } from 'typeorm';
import HabitUser from '../../../models/HabitUser';

export const getHabitsUsersChanges = async (
  userId: string,
  lastPulletAt?: number
) => {
  const habitsUsersRepository = getRepository(HabitUser);
  let habitsUsers: HabitUser[];

  if (lastPulletAt) {
    habitsUsers = await habitsUsersRepository.find({
      where: {
        last_modified: MoreThan(new Date(lastPulletAt)),
        user_id: userId,
      },
    });
  } else {
    habitsUsers = await habitsUsersRepository.find({
      where: {
        user_id: userId,
      },
    });
  }

  return habitsUsers;
};
