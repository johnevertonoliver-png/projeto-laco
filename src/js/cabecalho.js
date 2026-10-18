export function inicializarCabecalhoUsuario() {
  const botaoEntrar = document.getElementById('botao-entrar');
  const containerUsuarioLogado = document.getElementById('container-usuario-logado');
  const botaoPerfilMenu = document.getElementById('botao-perfil-menu');
  const menuSuspenso = document.getElementById('menu-suspenso');
  const textoPrimeiroNome = document.getElementById('texto-primeiro-nome');
  const linkSair = document.getElementById('link-sair');

  const dadosUsuarioLogado = localStorage.getItem('laco_usuario_logado');

  if (!dadosUsuarioLogado) return;

  const usuario = JSON.parse(dadosUsuarioLogado);

  if (botaoEntrar) {
    botaoEntrar.style.display = 'none';
  }
  
  if (containerUsuarioLogado) {
    containerUsuarioLogado.style.display = 'block';
  }

  if (textoPrimeiroNome && usuario.nome) {
    const primeiroNome = usuario.nome.trim().split(' ')[0];
    textoPrimeiroNome.textContent = primeiroNome;
  }

  if (botaoPerfilMenu && menuSuspenso) {
    botaoPerfilMenu.addEventListener('click', (evento) => {
      evento.stopPropagation();
      const estaVisivel = menuSuspenso.style.display === 'block';
      menuSuspenso.style.display = estaVisivel ? 'none' : 'block';
    });

    document.addEventListener('click', () => {
      menuSuspenso.style.display = 'none';
    });
  }

  if (linkSair) {
    linkSair.addEventListener('click', (evento) => {
      evento.preventDefault();
      localStorage.removeItem('laco_usuario_logado');
      window.location.reload();
    });
  }
}