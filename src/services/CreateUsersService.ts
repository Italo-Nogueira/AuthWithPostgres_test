import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs'
import User from '../models/User'

interface Request {
  name: string,
  email: string,
  password: string,
}

interface Response {
  user: User;
}

class CreateUserService {
  public async execute({ name, email, password }: Request): Promise<Response> {
    const userRepository = getRepository(User);

    const checkUserExists = await userRepository.findOne({
      where: { email },
    });

    if (checkUserExists) {
      throw new Error('email address already used')
    }

    const hashedPassword = await hash(password, 8);

    const user = userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    await userRepository.save(user);
    return user;
  }
}

export default CreateUserService
