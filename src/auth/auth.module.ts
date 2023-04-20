import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entites/user.entity';
import { Todo } from 'src/todo/entities/todo.entity';
import { UserModule } from 'src/user/user.module';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './controllers/auth/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Todo]),
    PassportModule,
    JwtModule.register({
      global: true,
      secret: 'test-secret',
      signOptions: { expiresIn: '10d' },
    }),
    forwardRef(() => UserModule),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
