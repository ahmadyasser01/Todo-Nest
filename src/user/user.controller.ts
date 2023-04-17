import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('')
  createUser(@Body() createUserDto: any) {
    return this.userService.createUser(createUserDto);
  }
}
