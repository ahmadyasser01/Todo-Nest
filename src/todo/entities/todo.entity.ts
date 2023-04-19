import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { TODO_STATUS } from '../Enums/todo-status.enum';
import { User } from 'src/user/entites/user.entity';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'enum', enum: TODO_STATUS })
  status: TODO_STATUS;

  @ManyToOne(() => User, (user) => user.todos)
  user: User;
}
