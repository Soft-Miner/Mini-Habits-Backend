import { EntityManager, MoreThan } from 'typeorm';
import HabitUser from '../../../models/HabitUser';
import yup from 'yup';
import { AppError } from '../../../errors/AppError';

export const applyHabitsUsersChanges = async (
  userId: string,
  habits_users: HabitUser[],
  lastPulletAt: number,
  transactionManager: EntityManager
) => {
  const schema = yup.array().of(
    yup.object().shape({
      id: yup.string().required(),
      user_id: yup.string().required(),
      habit_id: yup.string().required(),
      habit_challenge_id: yup.string().required(),
      time_sunday: yup.number().required(),
      time_monday: yup.number().required(),
      time_tuesday: yup.number().required(),
      time_wednesday: yup.number().required(),
      time_thursday: yup.number().required(),
      time_friday: yup.number().required(),
      time_saturday: yup.number().required(),
      deleted: yup.boolean().required(),
    })
  );

  try {
    await schema.validate(habits_users);
  } catch {
    throw new AppError("habits_users's format is incorrect.");
  }

  for (let i = 0; i < habits_users.length; i++) {
    const item = habits_users[i];

    if (item.user_id !== userId) {
      throw new AppError('You cannot change this.', 401);
    }

    delete item.last_modified;
    delete item.created_at;
  }

  const newerHabits = await transactionManager.count(HabitUser, {
    where: {
      last_modified: MoreThan(new Date(lastPulletAt)),
    },
  });

  if (newerHabits) {
    throw new AppError('You need to pull first.', 409);
  }

  const habitsUsersIds = habits_users.map((item) => item.id);

  const savedHabitsUsers = await transactionManager.findByIds(
    HabitUser,
    habitsUsersIds
  );

  for (let i = 0; i < savedHabitsUsers.length; i++) {
    const item = savedHabitsUsers[i];

    if (item.user_id !== userId) {
      throw new AppError('You cannot change this.', 401);
    }
  }

  await transactionManager.save(habits_users);
};
