import * as readline from 'readline';
import { AuthSimples } from './services/AuthSimples';
import { SenhaManager } from './repositories/SenhaManager';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const senhaManager = new SenhaManager();
const auth = new AuthSimples();

function menu(): void {
  console.log('\n=== Menu ===');
  console.log('1 - Cadastrar senha');
  console.log('2 - Listar senhas');
  console.log('3 - Editar senha');
  console.log('4 - Deletar senha');
  console.log('5 - Sair');

  rl.question('Opção: ', opcao => {
    switch (opcao) {
      case '1':
        rl.question('Login: ', login => {
          rl.question('Serviço: ', servico => {
            rl.question('Senha: ', senha => {
              console.log(senhaManager.cadastrar(login, servico, senha));
              menu();
            });
          });
        });
        break;

      case '2':
        senhaManager.mostrar();
        menu();
        break;

      case '3':
        editarSenha();
        break;

      case '4':
        deletarSenha();
        break;

      case '5':
        rl.close();
        break;

      default:
        console.log('Opção inválida.');
        menu();
        break;
    }
  });
}

function editarSenha(): void {
  const servicos = senhaManager.listarServicos();
  if (servicos.length == 0) {
    console.log('Nenhum serviço cadastrado.');
    menu();
    return;
  }

  console.log('Serviços:');
  servicos.forEach((s, i) => console.log(`${i + 1} - ${s}`));

  rl.question('Escolha serviço: ', si => {
    const indexServico = parseInt(si) - 1;
    const servico = servicos[indexServico];

    const grupo = senhaManager.getSenhasPorServico(servico);
    grupo.forEach((s, i) => console.log(`  ${i + 1} - Login: ${s.login}`));

    rl.question('Índice da senha a editar: ', idxStr => {
      const idx = parseInt(idxStr) - 1;
      rl.question('Nova senha: ', novaSenha => {
        console.log(senhaManager.editar(servico, idx, novaSenha));
        menu();
      });
    });
  });
}

function deletarSenha(): void {
  const servicos = senhaManager.listarServicos();
  if (servicos.length === 0) {
    console.log('Nenhum serviço cadastrado.');
    menu();
    return;
  }

  console.log('Serviços:');
  servicos.forEach((s, i) => console.log(`${i + 1} - ${s}`));

  rl.question('Escolha serviço: ', si => {
    const indexServico = parseInt(si) - 1;
    const servico = servicos[indexServico];

    const grupo = senhaManager.getSenhasPorServico(servico);
    grupo.forEach((s, i) => console.log(`  ${i + 1} - Login: ${s.login}`));

    rl.question('Índice da senha a deletar: ', idxStr => {
      const idx = parseInt(idxStr) - 1;
      console.log(senhaManager.deletar(servico, idx));
      menu();
    });
  });
}

menu();
