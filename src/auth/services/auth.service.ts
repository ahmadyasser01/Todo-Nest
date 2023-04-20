import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entites/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  public constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findByEmail(email);
    console.log(user, 'got user');
    if (user) return user;
    return null;
  }
  //FIXME: FIX type
  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      user,
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async hashPassword(password: string): Promise<string> {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    return hashedPassword;
  }
}
