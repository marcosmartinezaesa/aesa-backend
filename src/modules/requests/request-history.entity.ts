import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import { User } from '../users/user.entity';

@Entity('historial_solicitudes')
export class RequestHistoryEntity {
  @PrimaryColumn('char', { length: 36 })
  id!: string;

  @Column('char', { length: 36 })
  solicitud_id!: string;

  @Column('char', { length: 36 })
  usuario_id!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'usuario_id' })
  usuario!: User;

  @Column({
    type: 'enum',
    enum: [
      'CREACION',
      'EDICION',
      'APROBACION',
      'RECHAZO',
      'REENVIO',
      'IMPRESION',
      'REIMPRESION',
      'COMENTARIO',
    ],
  })
  accion!: string;

  @Column({
    type: 'enum',
    enum: ['PENDIENTE', 'RECHAZADA', 'AUTORIZADA', 'FINALIZADA'],
    nullable: true,
  })
  estado_anterior?: string;

  @Column({
    type: 'enum',
    enum: ['PENDIENTE', 'RECHAZADA', 'AUTORIZADA', 'FINALIZADA'],
    nullable: true,
  })
  estado_nuevo?: string;

  @Column({ type: 'text', nullable: true })
  comentario?: string;

  @CreateDateColumn()
  fecha_creacion!: Date;
}