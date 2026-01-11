
import { IAuth } from '../models/types';

export class AuthSimples implements IAuth {
  autenticar(usuario: string, senha: string): boolean {
    return usuario === 'admin' && senha === 'admin123';
  }
}
