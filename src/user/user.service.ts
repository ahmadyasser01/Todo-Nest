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
    const newUser = this.userRepository.create(userData);
    return this.userRepository.save(newUser);
  }
}
