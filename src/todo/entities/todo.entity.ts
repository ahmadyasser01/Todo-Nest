import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { TODO_STATUS } from '../Enums/todo-status.enum';
import { User } from 'src/user/entites/user.entity';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: TODO_STATUS;

  @Column()
  status: string;

  @ManyToOne(() => User, (user) => user.todos)
  user: User;
}
