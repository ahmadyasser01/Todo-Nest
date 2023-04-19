import { IsEnum, IsNotEmpty } from 'class-validator';
import { TODO_STATUS } from '../Enums/todo-status.enum';

export class CreateTaskDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsEnum(TODO_STATUS, {
    message: `Invalid status. Must be one of ${Object.values(TODO_STATUS).join(
      ', ',
    )}`,
  })
  @IsNotEmpty()
  status: TODO_STATUS;
}
