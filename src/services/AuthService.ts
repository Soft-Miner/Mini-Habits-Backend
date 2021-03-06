import { getRepository, Repository } from 'typeorm';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { AppError } from '../errors/AppError';
import User from '../models/User';

class AuthService {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async authenticate(email: string, password: string) {
    const user = await this.repository.findOne({ email });

    if (!user) {
      throw new AppError('Email or password is incorrect.', 401);
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
      throw new AppError('Email or password is incorrect.', 401);
    }

    const token = jwt.sign(
      {
        id: user.id,
        typ: 'access',
      },
      process.env.JWT_SECRET as string
    );

    return {
      token,
      user,
    };
  }
}

export default AuthService;
