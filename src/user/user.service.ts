import { Injectable } from '@nestjs/common';
import { User } from './entites/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  createUser(userData: any) {
    console.log('test');
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
}
