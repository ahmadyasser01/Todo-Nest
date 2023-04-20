import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getUser(@Request() req) {
    console.log('getting user');
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  updateUser(@Request() req: any, @Body() updates: UpdateUserDto) {
    return this.userService.updateUser(req.user.userId, updates);
  }
}
