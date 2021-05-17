import { getRepository, MoreThan } from 'typeorm';
import HabitChallenge from '../../../models/HabitChallenge';

export const getHabitsChallengesChanges = async (lastPulletAt?: number) => {
  const habitsChallengesRepository = getRepository(HabitChallenge);
  let habitsChallenges: HabitChallenge[];

  if (lastPulletAt) {
    habitsChallenges = await habitsChallengesRepository.find({
      where: {
        last_modified: MoreThan(new Date(lastPulletAt)),
      },
    });
  } else {
    habitsChallenges = await habitsChallengesRepository.find();
  }

  return habitsChallenges;
};
