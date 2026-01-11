export interface SenhaInfo {
  login: string;
  servico: string;
  senhaBase64: string;
}

export interface IAuth {
  autenticar(usuario: string, senha: string): boolean;
}
