import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  Get,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateTaskDto } from 'src/todo/dtos/create-todo.dto';
import { UpdateTaskDto } from 'src/todo/dtos/update-todo.dto';
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

  @UseGuards(JwtAuthGuard)
  @Get('')
  getTodos(
    @Request() req: any,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    console.log('passed user id', req.user);
    console.log('from conttoler', page, limit);
    return this.todoService.getTodos(req.user.userId, { page, limit });
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getTodo(@Param('id') id: number, @Request() req: any) {
    console.log('passed user id', req.user);
    return this.todoService.getTodo(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateTodo(
    @Param('id') id: number,
    @Request() req: any,
    @Body() updates: UpdateTaskDto,
  ) {
    console.log('passed user id', req.user);
    return this.todoService.updateTodo(id, req.user.userId, updates);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteTodo(@Param('id') id: number, @Request() req: any) {
    return this.todoService.deleteTodo(id, req.user.userId);
  }
}
