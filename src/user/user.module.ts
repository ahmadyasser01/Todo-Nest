import { Inject, Module, forwardRef } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entites/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from 'src/todo/entities/todo.entity';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from 'src/auth/services/auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Todo]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
