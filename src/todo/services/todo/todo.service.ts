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
  async getTodo(todoId: number, userId: any) {
    return this.todoRepository.findOne({
      where: { id: todoId, user: { id: userId } },
    });
  }

  async updateTodo(todoId: number, userId: any, updates: any) {
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
