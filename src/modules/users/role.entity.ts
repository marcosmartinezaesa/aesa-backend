import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

import { User } from './user.entity';

@Entity('roles')
export class Role {
  @PrimaryColumn('char', { length: 36 })
  id!: string;

  @Column({ length: 50 })
  nombre!: string;

  @Column({ nullable: true, type: 'text' })
  descripcion?: string;

  @CreateDateColumn()
  fecha_creacion!: Date;

  @OneToMany(() => User, (user) => user.rol)
  usuarios!: User[];
}