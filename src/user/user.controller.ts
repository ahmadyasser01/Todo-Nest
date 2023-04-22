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
import { CACHE_MANAGER } from '@nestjs/cache-manager/dist';
import { Cache } from 'cache-manager';
import { User } from './entites/user.entity';

@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
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
    const cacheKey = `user:${req.user.userId}`;
    let user = await this.cacheManager.get(cacheKey);
    if (user) {
      console.log('found in cache');
      return user;
    }
    console.log('not found in cache');
    user = await this.userService.findById(req.user.userId);
    if (!user) return new NotFoundException('User Not found');
    await this.cacheManager.set(cacheKey, user);

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
