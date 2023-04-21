import { Inject, Module, forwardRef } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entites/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from 'src/todo/entities/todo.entity';
import { AuthModule } from '../auth/auth.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Todo]),
    forwardRef(() => AuthModule),
    CacheModule.register({
      ttl: 600000, // seconds
      max: 10, // maximum number of items in cache
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
