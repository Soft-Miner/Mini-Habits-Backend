import { getRepository, Repository } from 'typeorm';
import { AppError } from '../errors/AppError';
import HabitChallenge from '../models/HabitChallenge';

class ChallengesService {
  private repository: Repository<HabitChallenge>;

  constructor() {
    this.repository = getRepository(HabitChallenge);
  }

  async edit(id: string, icon?: string, description?: string) {
    const challenge = await this.repository.findOne(id);

    if (!challenge) {
      throw new AppError('Challenge not found.', 404);
    }

    if (icon) {
      challenge.icon = icon;
    }

    if (description) {
      challenge.description = description;
    }

    await this.repository.save(challenge);

    return challenge;
  }
}

export default ChallengesService;
