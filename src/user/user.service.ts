import { Injectable } from '@nestjs/common';
import { User } from './entites/user.entity';
import { Repository, getConnection } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Todo } from 'src/todo/entities/todo.entity';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  createUser(userData: CreateUserDto) {
    const newUser = this.userRepository.create(userData);
    return this.userRepository.save(newUser);
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
}
