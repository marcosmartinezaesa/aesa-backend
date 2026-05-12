import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByUsuario(loginDto.usuario);

    if (!user) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }

    const passwordOk = await bcrypt.compare(loginDto.password, user.clave_hash);

    if (!passwordOk) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }

    const payload = {
    sub: user.id,
    usuario: user.id_usuario,
    rol: user.rol?.nombre,
    reparto: user.reparto,
  };

    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: user.id,
        usuario: user.id_usuario,
        nombre_visible: user.nombre_visible,
        reparto: user.reparto,
        rol: user.rol,
      },
    };
  }

  async refresh() {
    return { message: 'Refresh pendiente de implementar' };
  }

  async logout() {
    return { message: 'Logout pendiente de implementar' };
  }

  signToken(payload: Record<string, unknown>) {
    return this.jwtService.sign(payload);
  }
}