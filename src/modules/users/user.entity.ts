import {
  Column,
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Role } from './role.entity';
@Entity('usuarios')
export class User {
  @PrimaryColumn('char', { length: 36 })
  id!: string;

  @Column({ name: 'usuario', unique: true, length: 50 })
    id_usuario!: string;

  @Column()
  clave_hash!: string;

  @Column({ nullable: true, length: 120 })
  nombre_visible?: string;

  @Column('char', { length: 36 })
    rol_id!: string;

@ManyToOne(() => Role, (role) => role.usuarios)
@JoinColumn({ name: 'rol_id' })
rol!: Role;

  @Column({ nullable: true, length: 30 })
  reparto?: string;

  @Column({ default: true })
  activo!: boolean;

  @CreateDateColumn()
  fecha_creacion!: Date;

  @UpdateDateColumn()
  fecha_actualizacion!: Date;
}