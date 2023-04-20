import {
  Controller,
  Post,
  Request,
  UseGuards,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request as ExpressReq } from 'express';
import { AuthService } from 'src/auth/services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req: ExpressReq) {
    return this.authService.login(req.user);
  }
}
