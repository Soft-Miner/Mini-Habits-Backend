import { EntityManager, MoreThan } from 'typeorm';
import HabitUserDay from '../../../models/HabitUserDay';
import * as yup from 'yup';
import { AppError } from '../../../errors/AppError';

export const applyHabitUsersDaysChanges = async (
  userId: string,
  habits_users_days: HabitUserDay[],
  lastPulletAt: number,
  transactionManager: EntityManager
) => {
  await validateFormat(habits_users_days);
  await checkIfIsUpdated(lastPulletAt, transactionManager);
  await checkIfDataIsFromThisUser(
    habits_users_days,
    userId,
    transactionManager
  );
  deleteNonEditableFields(habits_users_days);

  await transactionManager.save(HabitUserDay, habits_users_days);
};

const validateFormat = async (habits_users_days: HabitUserDay[]) => {
  const schema = yup.array().of(
    yup.object().shape({
      id: yup.string().required(),
      habit_user_id: yup.string().required(),
      habit_challenge_id: yup.string().required(),
      completed_day: yup.string().required(),
    })
  );

  try {
    await schema.validate(habits_users_days);
  } catch {
    throw new AppError("habits_users_days's format is incorrect.");
  }
};

const checkIfIsUpdated = async (
  lastPulletAt: number,
  transactionManager: EntityManager
) => {
  const newerHabitsDays = await transactionManager.count(HabitUserDay, {
    where: {
      last_modified: MoreThan(
        new Date(lastPulletAt).toISOString().replace('T', ' ')
      ),
    },
  });

  if (newerHabitsDays) {
    throw new AppError('You need to pull first.', 409);
  }
};

const checkIfDataIsFromThisUser = async (
  habits_users_days: HabitUserDay[],
  userId: string,
  transactionManager: EntityManager
) => {
  const habitsUsersDaysIds = habits_users_days.map((item) => item.id);

  const savedHabitsUsersDays = await transactionManager.findByIds(
    HabitUserDay,
    habitsUsersDaysIds,
    {
      relations: ['habitUser'],
    }
  );

  for (let i = 0; i < savedHabitsUsersDays.length; i++) {
    const item = savedHabitsUsersDays[i];

    if (item.habitUser.user_id !== userId) {
      throw new AppError('You cannot change this.', 401);
    }
  }
};

const deleteNonEditableFields = (habits_users_days: HabitUserDay[]) => {
  habits_users_days.forEach((item) => {
    delete item.created_at;
    delete item.last_modified;
  });
};
