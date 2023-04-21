import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { User } from './entites/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Todo } from 'src/todo/entities/todo.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import * as faker from 'faker';
import { AuthService } from 'src/auth/services/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  createUser(userData: CreateUserDto) {
    const newUser = this.userRepository.create(userData);
    return this.userRepository.save(newUser);
  }
  async seed(count: number) {
    const users = [];
    const password = await this.authService.hashPassword('123456789');

    for (let i = 0; i < count; i++) {
      users.push({
        name: faker.name.findName(),
        email: `test${i}@test.com`,
        password: password,
      });
    }
    console.log(users[50]);
    return this.userRepository
      .createQueryBuilder()
      .insert()
      .into(User)
      .values(users)
      .execute();
  }
  async findByEmail(email: string): Promise<User | undefined> {
    console.log('test finding');
    return this.userRepository.findOne({ where: { email } });
  }
  async updateUser(id: number, updates: UpdateUserDto) {
    return this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({ ...updates })
      .where({ id })
      .execute();
  }

  async deleteUser(id: number) {
    const queryRunner =
      this.userRepository.manager.connection.createQueryRunner();
    try {
      await queryRunner.startTransaction();
      await queryRunner.manager.delete(Todo, { user: id });
      const deleteResult = await queryRunner.manager.delete(User, { id });
      await queryRunner.commitTransaction();
      return deleteResult;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
    }
  }
  async findAll() {
    return this.userRepository.find();
  }
  async findById(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }
}
