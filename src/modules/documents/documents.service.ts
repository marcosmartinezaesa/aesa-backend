import { Injectable } from '@nestjs/common';

@Injectable()
export class DocumentsService {
  upload(id: string) {
    return { message: 'Upload de documento pendiente de implementar', id };
  }

  findOne(id: string) {
    return { message: 'Lectura de documento pendiente de implementar', id };
  }

  remove(id: string) {
    return { message: 'Eliminacion de documento pendiente de implementar', id };
  }
}
