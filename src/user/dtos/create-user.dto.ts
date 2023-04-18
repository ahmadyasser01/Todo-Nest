import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  name: string;
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}