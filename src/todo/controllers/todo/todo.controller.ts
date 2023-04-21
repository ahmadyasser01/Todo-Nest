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
  BadRequestException,
  NotFoundException,
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
  async getTodo(@Param('id') id: number, @Request() req: any) {
    const todo = await this.todoService.getTodo(id, req.user.userId);
    if (!todo) return new NotFoundException();
    return todo;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateTodo(
    @Param('id') id: number,
    @Request() req: any,
    @Body() updates: UpdateTaskDto,
  ) {
    const updatedTodo = await this.todoService.updateTodo(
      id,
      req.user.userId,
      updates,
    );
    if (updatedTodo.affected) {
      return updatedTodo.raw[0];
    }
    return new BadRequestException();
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteTodo(@Param('id') id: number, @Request() req: any) {
    const deletedTodo = await this.todoService.deleteTodo(id, req.user.userId);

    if (deletedTodo.affected) {
      return;
    }
    return new BadRequestException();
  }
}
