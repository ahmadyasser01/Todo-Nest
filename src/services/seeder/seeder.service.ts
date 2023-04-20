import { Injectable } from '@nestjs/common';
import { TodoService } from 'src/todo/services/todo/todo.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class SeederService {
  public constructor(
    private readonly userService: UserService,
    private readonly todoService: TodoService,
  ) {}

  async seed(count: number): Promise<void> {
    console.log('START SEEDING...');
    // await this.userService.seed(count);
    console.log('Done seeding users...');
    await this.todoService.seed();
    console.log('DONE SEEDING...');
  }
}
