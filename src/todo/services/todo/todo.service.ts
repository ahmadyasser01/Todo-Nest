import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from 'src/todo/dtos/create-todo.dto';
import { UpdateTaskDto } from 'src/todo/dtos/update-todo.dto';
import { Todo } from 'src/todo/entities/todo.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import * as faker from 'faker';
import { TODO_STATUS } from 'src/todo/Enums/todo-status.enum';
@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo) private readonly todoRepository: Repository<Todo>,
    private readonly userService: UserService,
  ) {}

  async createTodo(taskData: CreateTaskDto, userId: any) {
    const todo = this.todoRepository.create({ ...taskData, user: userId });
    return await this.todoRepository.save(todo);
  }
  async getTodos(userId: any, { page = 1, limit = 10 } = {}) {
    return this.todoRepository.find({
      where: { user: { id: userId } },
      skip: (page - 1) * limit,
      take: limit,
    });
  }
  async getTodo(todoId: number, userId: any) {
    return this.todoRepository.findOne({
      where: { id: todoId, user: { id: userId } },
    });
  }
  async seed() {
    const users = await this.userService.findAll();
    const tasks = [];

    for (let i = 0; i < users.length / 2; i++) {
      const min = 1;
      const max = 5;
      const tasksCount = Math.floor(Math.random() * (max - min + 1)) + min;
      for (let j = 0; j < tasksCount; j++) {
        tasks.push({
          title: faker.lorem.word(1),
          description: faker.lorem.word(5),
          status: TODO_STATUS.TODO,
          user: users[i].id,
        });
      }
    }
    return this.todoRepository
      .createQueryBuilder()
      .insert()
      .into(Todo)
      .values(tasks)
      .execute();
  }

  async updateTodo(todoId: number, userId: any, updates: UpdateTaskDto) {
    return this.todoRepository
      .createQueryBuilder()
      .update(Todo)
      .set(updates)
      .where({
        id: todoId,
        user: userId,
      })
      .execute();
  }

  async deleteTodo(todoId: number, userId: any) {
    return this.todoRepository
      .createQueryBuilder()
      .delete()
      .from(Todo)
      .where({
        id: todoId,
        user: userId,
      })
      .execute();
  }
}
