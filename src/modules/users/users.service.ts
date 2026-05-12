import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
  return this.usersRepository.find({
    relations: {
      rol: true,
    },
    select: {
      id: true,
      id_usuario: true,
      nombre_visible: true,
      reparto: true,
      activo: true,
      fecha_creacion: true,
      fecha_actualizacion: true,
      rol: {
        id: true,
        nombre: true,
        descripcion: true,
      },
    },
  });
}

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return user;
  }

  async deactivate(id: string): Promise<{ message: string }> {
    const user = await this.findOne(id);

    user.activo = false;
    await this.usersRepository.save(user);

    return {
      message: 'Usuario desactivado correctamente',
    };
  }
  
  async findByUsuario(usuario: string): Promise<User | null> {
  return this.usersRepository.findOne({
    where: { id_usuario: usuario, activo: true },
    relations: {
      rol: true,
    },
  });
}
}