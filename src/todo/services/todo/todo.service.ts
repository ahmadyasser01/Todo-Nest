import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from 'src/todo/dtos/create-todo.dto';
import { UpdateTaskDto } from 'src/todo/dtos/update-todo.dto';
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
