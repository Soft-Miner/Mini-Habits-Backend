import { getRepository, Repository } from 'typeorm';
import { AppError } from '../errors/AppError';
import Habit from '../models/Habit';
import HabitChallenge from '../models/HabitChallenge';

class HabitsService {
  private repository: Repository<Habit>;

  constructor() {
    this.repository = getRepository(Habit);
  }

  async create(
    name: string,
    description: string,
    challenges: HabitChallenge[],
    icon: string
  ) {
    const existChallengWithZero = challenges.find((challenge) => {
      return challenge.level === 0;
    });

    if (!existChallengWithZero) {
      throw new AppError('At least one challenge must be level 0.');
    }

    const habitAlreadyExists = await this.repository.findOne({ name });

    if (habitAlreadyExists) {
      throw new AppError('A habit already exists with this name.');
    }

    const habit = this.repository.create({
      name,
      description,
      icon,
      challenges,
    });

    await this.repository.save(habit);

    return habit;
  }

  async addChallenge(habitId: string, challenge: HabitChallenge) {
    const habit = await this.repository.findOne(habitId, {
      relations: ['challenges'],
    });

    if (!habit) {
      throw new AppError('Habit not found.', 404);
    }

    habit.challenges.push(challenge);

    this.repository.save(habit);

    return challenge;
  }

  async edit(id: string, name?: string, description?: string, icon?: string) {
    const habit = await this.repository.findOne(id);

    if (!habit) {
      throw new AppError('Habit not found.', 404);
    }

    if (!name && !description && !icon) {
      return habit;
    }

    if (name) {
      habit.name = name;
    }

    if (description) {
      habit.description = description;
    }

    if (icon) {
      habit.icon = icon;
    }

    await this.repository.save(habit);

    return habit;
  }
}

export default HabitsService;
