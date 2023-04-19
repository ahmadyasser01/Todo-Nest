import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateTaskDto } from 'src/todo/dtos/create-todo.dto';
import { TodoService } from 'src/todo/services/todo/todo.service';

@Controller('todos')
export class TodoController {
  constructor(private todoService: TodoService) {}
  //TODO: CRUD OPERATIONS FOR  TODO
  /**
   * TODO: create a todo
   */
  @UseGuards(JwtAuthGuard)
  @Post('')
  createTodo(@Body() createTodoDto: CreateTaskDto, @Request() req: any) {
    console.log('passed user id', req.user);
    return this.todoService.createTodo(createTodoDto, req.user.userId);
  }
}
