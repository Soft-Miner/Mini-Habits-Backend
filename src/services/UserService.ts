import { AppError } from '../errors/AppError';

interface User {
  id: string;
  name?: string;
}

class UserService {
  async create(name: string): Promise<User> {
    if (!name) {
      throw new AppError('Invalid Name.', 400);
    }

    const user: User = {
      id: Math.floor(Math.random() * 100).toString(),
      name,
    };

    return user;
  }
}

export default UserService;
