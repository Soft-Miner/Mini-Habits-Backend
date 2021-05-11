import { getManager, getRepository, Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { resolve } from 'path';
import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import User from '../models/User';
import { AppError } from '../errors/AppError';
import PasswordResetRequest from '../models/PasswordResetRequest';
import SendMailService from './SendMailService';

interface TokenPayload {
  id: string;
}

class UsersService {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async create(
    name: string,
    lastname: string,
    email: string,
    password: string
  ): Promise<User> {
    const userWithThisEmail = await this.repository.findOne({ email });

    if (userWithThisEmail) {
      throw new AppError('A user already exists with this email.');
    }

    let user: User;

    const userWithThisEmailToVerify = await this.repository.findOne({
      email_to_verify: email,
    });

    const passwordHash = await bcrypt.hash(password, 10);

    if (userWithThisEmailToVerify) {
      user = userWithThisEmailToVerify;
      user.name = name;
      user.lastname = lastname;
      user.password = passwordHash;
    } else {
      user = this.repository.create({
        name,
        lastname,
        password: passwordHash,
        email_to_verify: email,
      });
    }

    await this.repository.save(user);

    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_SECRET as string,
      {
        jwtid: uuid(),
      }
    );

    await SendMailService.execute({
      to: email,
      subject: 'Confirmação de Email',
      variables: {
        name,
        link: `https://mini-habitos.soft-miner.com/verificar-email/${token}`,
      },
      path: resolve(__dirname, '../../views/emails/confirmEmail.hbs'),
    });

    return user;
  }

  async requestNewPassword(email: string): Promise<void> {
    const user = await this.repository.findOne({ email });

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    const requestSecret = uuid();
    const requestSecretHash = await bcrypt.hash(requestSecret, 10);

    const resetRequestsRepository = getRepository(PasswordResetRequest);

    const resetRequestFromThisUser = await resetRequestsRepository.findOne({
      user_id: user.id,
    });

    let resetRequest: PasswordResetRequest;

    if (resetRequestFromThisUser) {
      resetRequest = resetRequestFromThisUser;
      resetRequest.request_secret = requestSecretHash;
    } else {
      resetRequest = resetRequestsRepository.create({
        request_secret: requestSecretHash,
        user_id: user.id,
      });
    }

    await resetRequestsRepository.save(resetRequest);

    await SendMailService.execute({
      to: email,
      subject: 'Recupere sua senha',
      variables: {
        name: user.name,
        link: `https://mini-habitos.soft-miner.com/redefinir-senha/${resetRequest.id}/${requestSecret}`,
      },
      path: resolve(__dirname, '../../views/emails/recoverPassword.hbs'),
    });
  }

  async verifyEmail(token: string) {
    let decodedToken: TokenPayload;
    try {
      decodedToken = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as TokenPayload;
    } catch (error) {
      throw new AppError('Invalid token.', 401);
    }

    const userId = decodedToken.id;

    const user = await this.repository.findOne(userId);

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    if (!user.email_to_verify) {
      throw new AppError('This email was already verified.');
    }

    user.email = user.email_to_verify;
    user.email_to_verify = null;

    await this.repository.save(user);
  }

  async newPassword(
    requestId: string,
    requestSecret: string,
    password: string
  ): Promise<void> {
    const resetRequestsRepository = getRepository(PasswordResetRequest);

    const resetRequest = await resetRequestsRepository.findOne(requestId);

    if (!resetRequest) {
      throw new AppError('requestId not found.', 404);
    }

    const validRequestSecret = await bcrypt.compare(
      requestSecret,
      resetRequest.request_secret
    );

    if (!validRequestSecret) {
      throw new AppError('Invalid requestSecret.', 401);
    }

    const user = (await this.repository.findOne(resetRequest.user_id)) as User;

    const passwordHash = await bcrypt.hash(password, 10);

    user.password = passwordHash;

    await getManager().transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.save(user);
      await transactionalEntityManager.remove(resetRequest);
    });
  }

  async update(id: string, name?: string, lastname?: string) {
    const user = await this.repository.findOne(id);

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    if (!name && !lastname) {
      return user;
    }

    if (name) {
      user.name = name;
    }

    if (lastname) {
      user.lastname = lastname;
    }

    await this.repository.save(user);

    return user;
  }

  async updateEmail(id: string, new_email: string, password: string) {
    const user = await this.repository.findOne(id);

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
      throw new AppError('Password is incorrect.', 401);
    }

    const userWithThisEmail = await this.repository.findOne({
      email: new_email,
    });

    if (userWithThisEmail) {
      throw new AppError('A user already exists with this email.');
    }

    user.email_to_verify = new_email;

    await this.repository.save(user);

    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_SECRET as string,
      {
        jwtid: uuid(),
      }
    );

    await SendMailService.execute({
      to: user.email_to_verify,
      subject: 'Confirmação de Email',
      variables: {
        name: user.name,
        link: `https://mini-habitos.soft-miner.com/verificar-email/${token}`,
      },
      path: resolve(__dirname, '../../views/emails/confirmEmail.hbs'),
    });

    return user;
  }
}

export default UsersService;
