import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from 'src/todo/dtos/create-todo.dto';
import { Todo } from 'src/todo/entities/todo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo) private readonly todoRepository: Repository<Todo>,
  ) {}

  async createTodo(taskData: CreateTaskDto, userId: any) {
    const todo = this.todoRepository.create({ ...taskData, user: userId });
    return await this.todoRepository.save(todo);
  }
  async getTodos(userId: any) {
    return this.todoRepository.find({
      where: { user: { id: userId } },
    });
  }
}
