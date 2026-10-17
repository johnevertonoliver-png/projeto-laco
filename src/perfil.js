document.addEventListener('DOMContentLoaded', () => {
 
  const usuarioSalvo = localStorage.getItem('laco_usuario_logado');

  if (usuarioSalvo) {
    const usuario = JSON.parse(usuarioSalvo);
    const elementoNome = document.getElementById('usuario-nome');

    if (usuario.nome) {
      elementoNome.textContent = usuario.nome;
    }
  }

  const botaoSair = document.getElementById('botao-sair');
  if (botaoSair) {
    botaoSair.addEventListener('click', (evento) => {
      evento.preventDefault();
      localStorage.removeItem('laco_usuario_logado');
      window.location.href = 'login.html';
    });
  }

 
  const containerPetsPerfil = document.getElementById('lista-pets-perfil');

  function renderizarPetsPerfil() {
    if (!containerPetsPerfil) return;

    const usuarioLogado = JSON.parse(localStorage.getItem('laco_usuario_logado'));
    const petsSalvos = JSON.parse(localStorage.getItem('laco_pets')) || [];
    
    containerPetsPerfil.innerHTML = '';


    const meusPets = petsSalvos.filter(pet => usuarioLogado && pet.donoEmail === usuarioLogado.email);

    if (meusPets.length === 0) {
      containerPetsPerfil.innerHTML = '<p style="color: #64748b; font-size: 14px; padding: 12px 0;">Ainda não tens nenhum pet cadastrado.</p>';
      return;
    }

    meusPets.forEach(pet => {
      const cardPerfil = document.createElement('div');
      cardPerfil.classList.add('card-pet-perfil');

      const statusAtual = pet.status || 'disponivel';

      cardPerfil.innerHTML = `
        <div class="pet-perfil-info">
          <img src="${pet.foto}" alt="${pet.nome}" class="pet-perfil-foto" />
          <div class="pet-perfil-detalhes">
            <span class="badge-status ${statusAtual}">${statusAtual}</span>
            <h3>${pet.nome}</h3>
            <p>${pet.especie} · ${pet.idade} · ${pet.cidade}</p>
          </div>
        </div>
        <div class="pet-perfil-acoes">
          <button class="botao-acao alternar-status" data-id="${pet.id}">
            ✓ ${statusAtual === 'adotado' ? 'reabrir adoção' : 'marcar adotado'}
          </button>
          <button class="botao-acao excluir" data-id="${pet.id}" title="Excluir pet">
            🗑️ Excluir
          </button>
        </div>
      `;

      containerPetsPerfil.appendChild(cardPerfil);
    });

    adicionarEventosAcoesPerfil();
  }

  /* funções para gerir exclusão e alteração de status no perfil */
  function adicionarEventosAcoesPerfil() {

    document.querySelectorAll('.botao-acao.excluir').forEach(botao => {
      botao.addEventListener('click', (e) => {
        const idPet = Number(e.currentTarget.getAttribute('data-id'));
        let petsSalvos = JSON.parse(localStorage.getItem('laco_pets')) || [];
        
        petsSalvos = petsSalvos.filter(p => p.id !== idPet);
        
        localStorage.setItem('laco_pets', JSON.stringify(petsSalvos));
        renderizarPetsPerfil();
      });
    });

    /*botão de alternar status (disponível / adotado) */
    document.querySelectorAll('.botao-acao.alternar-status').forEach(botao => {
      botao.addEventListener('click', (e) => {
        const idPet = Number(e.currentTarget.getAttribute('data-id'));
        let petsSalvos = JSON.parse(localStorage.getItem('laco_pets')) || [];
        
        petsSalvos = petsSalvos.map(p => {
          if (p.id === idPet) {
            p.status = p.status === 'adotado' ? 'disponivel' : 'adotado';
          }
          return p;
        });

        localStorage.setItem('laco_pets', JSON.stringify(petsSalvos));
        renderizarPetsPerfil();
      });
    });
  }

  /* executa a listagem inicial no perfil */
  renderizarPetsPerfil();

  /* controle de abertura e fechamento do modal de cadastro */
  const botaoCadastrar = document.querySelector('.botao-cadastrar');
  const modalCadastrar = document.getElementById('modal-cadastrar');
  const botaoFecharModal = document.getElementById('botao-fechar-modal');
  const botaoCancelarModal = document.getElementById('botao-cancelar-modal');
  const formularioCadastrarPet = document.getElementById('formulario-cadastrar-pet');

  function abrirModal() {
    modalCadastrar.classList.add('ativo');
  }

  function fecharModal() {
    modalCadastrar.classList.remove('ativo');
    formularioCadastrarPet.reset();
  }

  if (botaoCadastrar) {
    botaoCadastrar.addEventListener('click', abrirModal);
  }

  if (botaoFecharModal) {
    botaoFecharModal.addEventListener('click', fecharModal);
  }

  if (botaoCancelarModal) {
    botaoCancelarModal.addEventListener('click', fecharModal);
  }

  /* fecha o modal ao clicar fora da caixa branca */
  window.addEventListener('click', (evento) => {
    if (evento.target === modalCadastrar) {
      fecharModal();
    }
  });


  /* salvar os dados do pet no localStorage associando ao dono */
  if (formularioCadastrarPet) {
    formularioCadastrarPet.addEventListener('submit', (evento) => {
      evento.preventDefault();

      
      const usuarioLogado = JSON.parse(localStorage.getItem('laco_usuario_logado'));
      const donoEmail = usuarioLogado ? usuarioLogado.email : 'desconhecido';

      const novoPet = {
        id: Date.now(),
        donoEmail: donoEmail, /* guarda quem publicou */
        nome: document.getElementById('pet-nome').value,
        idade: document.getElementById('pet-idade').value,
        especie: document.getElementById('pet-especie').value,
        raca: document.getElementById('pet-raca').value,
        cidade: document.getElementById('pet-cidade').value,
        sexo: document.getElementById('pet-sexo').value,
        porte: document.getElementById('pet-porte').value,
        sobre: document.getElementById('pet-sobre').value,
        status: 'disponível',
        foto: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1' /* foto padrão temporária */
      };

      const petsSalvos = JSON.parse(localStorage.getItem('laco_pets')) || [];
      petsSalvos.push(novoPet);
      localStorage.setItem('laco_pets', JSON.stringify(petsSalvos));

      fecharModal();
      renderizarPetsPerfil(); 
    });
  }
});