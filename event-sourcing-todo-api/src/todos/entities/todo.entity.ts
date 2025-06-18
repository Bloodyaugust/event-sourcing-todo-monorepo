import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Todo {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  done: boolean;

  @Column()
  createdAt: string;

  @Column()
  updatedAt: string;
}
