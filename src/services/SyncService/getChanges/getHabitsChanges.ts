import { getRepository, MoreThan } from 'typeorm';
import Habit from '../../../models/Habit';

export const getHabitsChanges = async (lastPulletAt?: number) => {
  const habitsRepository = getRepository(Habit);
  let habits: Habit[];

  if (lastPulletAt) {
    habits = await habitsRepository.find({
      where: {
        last_modified: MoreThan(new Date(lastPulletAt)),
      },
    });
  } else {
    habits = await habitsRepository.find();
  }

  return habits;
};
