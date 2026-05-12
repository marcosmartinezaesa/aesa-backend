import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('solicitudes')
export class RequestEntity {
  @PrimaryColumn('char', { length: 36 })
  id!: string;

  @Column({ length: 30, unique: true })
  numero_solicitud!: string;

  @Column({
    type: 'enum',
    enum: ['NUEVO_FRIO_CALOR', 'REPARADA', 'RECONEXION'],
  })
  tipo_solicitud!: string;

  @Column({ length: 50 })
  codigo_cliente!: string;

  @Column({ nullable: true, length: 30 })
  telefono?: string;

  @Column({
    type: 'enum',
    enum: ['PENDIENTE', 'RECHAZADA', 'AUTORIZADA', 'FINALIZADA'],
    default: 'PENDIENTE',
  })
  estado!: string;

  @Column({ nullable: true, type: 'text' })
  observacion_repartidor?: string;

  @Column({ nullable: true, type: 'text' })
  comentario_administracion?: string;

  @Column({ nullable: true, length: 30 })
  reparto?: string;

  @Column('char', { length: 36 })
  creado_por!: string;

  @Column('char', { nullable: true, length: 36 })
  autorizado_por?: string;

  @Column('char', { nullable: true, length: 36 })
  impreso_por?: string;

  @CreateDateColumn()
  fecha_creacion!: Date;

  @UpdateDateColumn()
  fecha_actualizacion!: Date;

  @Column({ nullable: true, type: 'timestamp' })
  fecha_autorizacion?: Date;

  @Column({ nullable: true, type: 'timestamp' })
  fecha_impresion?: Date;

  @Column({ default: 0 })
  cantidad_impresiones!: number;
}