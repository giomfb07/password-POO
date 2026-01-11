import * as fs from 'fs';
import { SenhaInfo } from '../models/types';

export class SenhaManager {
  private senhas: SenhaInfo[] = [];
  private readonly arquivo = 'src/password.json';

  constructor() {
    this.carregarSenhas();
  }

  private encriptarSenha(senha: string): string {
    return Buffer.from(senha).toString('base64');
  }

  private desencriptarSenha(senhaBase64: string): string {
    return Buffer.from(senhaBase64, 'base64').toString('utf8');
  }

  private carregarSenhas(): void {
    if (fs.existsSync(this.arquivo)) {
      const dados = fs.readFileSync(this.arquivo, 'utf8');
      this.senhas = JSON.parse(dados);
    }
  }

  private salvarSenhas(): void {
    fs.writeFileSync(this.arquivo, JSON.stringify(this.senhas, null, 2));
  }

  private senhaFraca(senha: string): boolean {
    return senha.length < 8;
  }

  cadastrar(login: string, servico: string, senha: string): string {
    if (this.senhas.find(s => s.login === login && s.servico === servico)) {
      return 'Erro: senha já cadastrada para este login e serviço.';
    }
    const senhaBase64 = this.encriptarSenha(senha);
    this.senhas.push({ login, servico, senhaBase64 });
    this.salvarSenhas();
    return this.senhaFraca(senha)
      ? 'Senha cadastrada, mas ela é fraca (menos de 8 caracteres).'
      : 'Senha cadastrada com sucesso!';
  }

  mostrar(): void {
    if (this.senhas.length === 0) {
      console.log('Nenhuma senha cadastrada.');
      return;
    }
    const grupos: { [servico: string]: SenhaInfo[] } = {};
    this.senhas.forEach(s => {
      if (!grupos[s.servico]) grupos[s.servico] = [];
      grupos[s.servico].push(s);
    });

    for (const servico in grupos) {
      console.log(`\nServiço: ${servico}`);
      grupos[servico].forEach((s, i) => {
        console.log(`  ${i + 1} - Login: ${s.login}, Senha: ${this.desencriptarSenha(s.senhaBase64)}`);
      });
    }
  }

  editar(servico: string, indice: number, novaSenha: string): string {
    const grupo = this.senhas.filter(s => s.servico === servico);
    if (!grupo[indice]) return 'Índice inválido.';
    const pos = this.senhas.indexOf(grupo[indice]);
    this.senhas[pos].senhaBase64 = this.encriptarSenha(novaSenha);
    this.salvarSenhas();
    return this.senhaFraca(novaSenha) ? 'Senha atualizada, mas é fraca.' : 'Senha atualizada com sucesso!';
  }

  deletar(servico: string, indice: number): string {
    const grupo = this.senhas.filter(s => s.servico === servico);
    if (!grupo[indice]) return 'Índice inválido.';
    const pos = this.senhas.indexOf(grupo[indice]);
    this.senhas.splice(pos, 1);
    this.salvarSenhas();
    return 'Senha deletada com sucesso!';
  }

  listarServicos(): string[] {
    return [...new Set(this.senhas.map(s => s.servico))];
  }

  getSenhasPorServico(servico: string): SenhaInfo[] {
    return this.senhas.filter(s => s.servico === servico);
  }
}
