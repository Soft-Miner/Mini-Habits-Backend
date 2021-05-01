import { getRepository, Repository } from 'typeorm';
import { AppError } from '../errors/AppError';
import SuperUser from '../models/SuperUser';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';

interface RefreshToken {
  id: string;
}

class SuperUsersService {
  private repository: Repository<SuperUser>;

  constructor() {
    this.repository = getRepository(SuperUser);
  }

  async authenticate(email: string, password: string) {
    const superUser = await this.repository.findOne({ email: email });

    if (!superUser) {
      throw new AppError('Email or password is incorrect.');
    }

    const passwordIsValid = await bcrypt.compare(password, superUser.password);

    if (!passwordIsValid) {
      throw new AppError('Email or password is incorrect.');
    }

    const access_token = jwt.sign(
      {
        id: superUser.id,
      },
      process.env.JWT_SECRET as string,
      {
        jwtid: uuid(),
        expiresIn: 60 * 5, // 5 minutes
      }
    );

    const refresh_token = jwt.sign(
      {
        id: superUser.id,
      },
      process.env.JWT_SECRET as string,
      {
        jwtid: uuid(),
        expiresIn: '1d', // 1 day
      }
    );

    const refresh_token_hash = await bcrypt.hash(refresh_token, 10);

    superUser.refresh_token = refresh_token_hash;

    await this.repository.save(superUser);

    return {
      access_token: access_token,
      refresh_token: refresh_token,
    };
  }

  async refreshToken(refresh_token: string) {
    let decodedToken: RefreshToken;
    try {
      decodedToken = jwt.verify(
        refresh_token,
        process.env.JWT_SECRET as string
      ) as RefreshToken;
    } catch (error) {
      throw new AppError('Invalid refresh_token.');
    }

    const superUser = await this.repository.findOne(decodedToken.id);

    if (!superUser) {
      throw new AppError('Invalid refresh_token.');
    }

    const refreshTokenIsValid = await bcrypt.compare(
      refresh_token,
      superUser.refresh_token
    );

    if (!refreshTokenIsValid) {
      throw new AppError('Invalid refresh_token.');
    }

    const access_token = jwt.sign(
      {
        id: superUser.id,
      },
      process.env.JWT_SECRET as string,
      {
        jwtid: uuid(),
        expiresIn: 60 * 5, // 5 minutes
      }
    );

    const new_refresh_token = jwt.sign(
      {
        id: superUser.id,
      },
      process.env.JWT_SECRET as string,
      {
        jwtid: uuid(),
        expiresIn: '1d', // 1 day
      }
    );

    const refresh_token_hash = await bcrypt.hash(new_refresh_token, 10);

    superUser.refresh_token = refresh_token_hash;

    await this.repository.save(superUser);

    return {
      refresh_token: new_refresh_token,
      access_token,
    };
  }
}

export default SuperUsersService;
