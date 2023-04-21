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
  BadRequestException,
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
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateUser(@Request() req: any, @Body() updates: UpdateUserDto) {
    if (updates.password)
      updates.password = await this.authService.hashPassword(updates.password);

    const updatedUser = await this.userService.updateUser(
      req.user.userId,
      updates,
    );
    if (updatedUser.affected) {
      delete updatedUser.raw[0].password;
      return updatedUser.raw[0];
    }
    return new BadRequestException();
  }

  @UseGuards(JwtAuthGuard)
  @Delete('profile')
  async deleteUser(@Request() req: any) {
    const result = await this.userService.deleteUser(req.user.userId);
    if (result.affected) {
      return;
    }
    return new BadRequestException();
  }
}
