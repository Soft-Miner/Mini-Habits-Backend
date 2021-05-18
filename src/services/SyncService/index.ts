import { getConnection } from 'typeorm';
import Habit from '../../models/Habit';
import HabitChallenge from '../../models/HabitChallenge';
import HabitUser from '../../models/HabitUser';
import HabitUserDay from '../../models/HabitUserDay';
import {
  applyHabitsUsersChanges,
  applyHabitUsersDaysChanges,
} from './applyChanges';
import {
  getHabitsChallengesChanges,
  getHabitsChanges,
  getHabitsUsersChanges,
  getHabitsUsersDaysChanges,
} from './getChanges';

interface PushChanges {
  habits_users?: HabitUser[];
  habits_users_days?: HabitUserDay[];
}

interface PullChanges {
  changes: {
    habits: Habit[];
    habits_challenges: HabitChallenge[];
    habits_users: HabitUser[];
    habits_users_days: HabitUserDay[];
  };
  currentTime: number;
}

class SyncService {
  async applyChanges(
    changes: PushChanges,
    userId: string,
    lastPulletAt: number
  ) {
    const { habits_users, habits_users_days } = changes;

    await getConnection().transaction(async (transactionManager) => {
      if (habits_users) {
        await applyHabitsUsersChanges(
          userId,
          habits_users,
          lastPulletAt,
          transactionManager
        );
      }

      if (habits_users_days) {
        await applyHabitUsersDaysChanges(
          userId,
          habits_users_days,
          lastPulletAt,
          transactionManager
        );
      }
    });
  }

  async getChanges(
    userId: string,
    lastPulletAt?: number
  ): Promise<PullChanges> {
    const currentTime = new Date().getTime();

    const habits = await getHabitsChanges(lastPulletAt);
    const habits_challenges = await getHabitsChallengesChanges(lastPulletAt);
    const habits_users = await getHabitsUsersChanges(userId, lastPulletAt);
    const habits_users_days = await getHabitsUsersDaysChanges(
      userId,
      lastPulletAt
    );

    return {
      currentTime,
      changes: {
        habits,
        habits_challenges,
        habits_users,
        habits_users_days,
      },
    };
  }
}

export default SyncService;
