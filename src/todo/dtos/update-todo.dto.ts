import { IsEnum, IsNotEmpty } from 'class-validator';
import { TODO_STATUS } from '../Enums/todo-status.enum';

export class UpdateTaskDto {
  title: string;

  description: string;

  @IsEnum(TODO_STATUS, {
    message: `Invalid status. Must be one of ${Object.values(TODO_STATUS).join(
      ', ',
    )}`,
  })
  status: TODO_STATUS;
}
