import { Injectable } from '@nestjs/common';
import { User } from './entites/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

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
}