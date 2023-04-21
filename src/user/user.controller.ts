import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Request,
  UseGuards,
  ClassSerializerInterceptor,
  UseInterceptors,
  forwardRef,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateUserDto } from './dtos/update-user.dto';
import { AuthService } from 'src/auth/services/auth.service';

@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('')
  async createUser(@Body() createUserDto: CreateUserDto) {
    createUserDto.password = await this.authService.hashPassword(
      createUserDto.password,
    );
    return this.userService.createUser(createUserDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getUser(@Request() req) {
    const user = await this.userService.findById(req.user.userId);
    if (!user) return new NotFoundException('User Not found');

    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  updateUser(@Request() req: any, @Body() updates: UpdateUserDto) {
    return this.userService.updateUser(req.user.userId, updates);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('profile')
  deleteUser(@Request() req: any) {
    return this.userService.deleteUser(req.user.userId);
  }
}
