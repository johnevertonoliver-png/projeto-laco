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

  /* controle de abas "Meus pets" e "Favoritos" */
  const menuMeusPets = document.getElementById('menu-meus-pets');
  const menuFavoritos = document.getElementById('menu-favoritos');
  const secaoMeusPets = document.getElementById('secao-meus-pets');
  const secaoFavoritos = document.getElementById('secao-favoritos');

  const tituloPrincipal = document.querySelector('.titulo-principal');
  const botaoCadastrar = document.querySelector('.botao-cadastrar');

  if (menuMeusPets && menuFavoritos) {
    /* clique na aba "Meus pets" */
    menuMeusPets.addEventListener('click', (e) => {
      e.preventDefault();
      menuMeusPets.classList.add('ativo');
      menuFavoritos.classList.remove('ativo');
      
      /* mostra a seção de meus pets e esconde a de favoritos */
      if (secaoMeusPets) secaoMeusPets.style.display = 'block';
      if (secaoFavoritos) secaoFavoritos.style.display = 'none';

      if (tituloPrincipal) tituloPrincipal.textContent = 'Meus pets publicados';
      if (botaoCadastrar) botaoCadastrar.style.display = 'inline-flex';

    });

    /* clique na aba "Favoritos" */
    menuFavoritos.addEventListener('click', (e) => {
      e.preventDefault();
      menuFavoritos.classList.add('ativo');
      menuMeusPets.classList.remove('ativo');
      
      /*Esconde a seção de meus pets e mostra a de favoritos */
      if (secaoMeusPets) secaoMeusPets.style.display = 'none';
      if (secaoFavoritos) secaoFavoritos.style.display = 'block';

      if (tituloPrincipal) tituloPrincipal.textContent = 'Meus pets favoritos';
      if (botaoCadastrar) botaoCadastrar.style.display = 'none'; 

      renderizarFavoritosPerfil();
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
        atualizarEstatisticas();
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
        atualizarEstatisticas();
      });
    });
  }

  /* executa a listagem inicial no perfil */
  renderizarPetsPerfil();
  atualizarEstatisticas();


  /* renderizar favoritos no perfil */
  const containerFavoritosPerfil = document.getElementById('lista-favoritos-perfil');

  function renderizarFavoritosPerfil() {
    if (!containerFavoritosPerfil) return;

    const usuarioLogado = JSON.parse(localStorage.getItem('laco_usuario_logado'));
    if (!usuarioLogado) return;

    const chaveFavoritos = `laco_favoritos_${usuarioLogado.email}`;
    const idsFavoritos = JSON.parse(localStorage.getItem(chaveFavoritos)) || [];
    const petsSalvos = JSON.parse(localStorage.getItem('laco_pets')) || [];

    const meusFavoritos = petsSalvos.filter(pet => idsFavoritos.includes(pet.id));

    containerFavoritosPerfil.innerHTML = '';

    if (meusFavoritos.length === 0) {
      containerFavoritosPerfil.innerHTML = '<p style="color: #64748b; font-size: 14px; padding: 12px 0;">Você ainda não favoritou nenhum pet.</p>';
      return;
    }

    meusFavoritos.forEach(pet => {
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
          <button class="botao-acao ver-perfil" data-id="${pet.id}">
            🔍 Ver perfil
          </button>
        </div>
      `;

      containerFavoritosPerfil.appendChild(cardPerfil);
    });
  }

  /* controle de abertura e fechamento do modal de cadastro */
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

      /* validacao para exigir o envio da foto antes de salvar */
    if (!urlFotoPet) {
      alert('Por favor, selecione e envie uma foto do pet!');
      return;
    }

      
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
        foto: urlFotoPet /* usa a URL da foto enviada pelo Cloudinary */
      };

      const petsSalvos = JSON.parse(localStorage.getItem('laco_pets')) || [];
      petsSalvos.push(novoPet);
      localStorage.setItem('laco_pets', JSON.stringify(petsSalvos));

      /* reseta a foto e o formulário para o próximo cadastro */
      urlFotoPet = '';
      if (txtNomeFoto) {
      txtNomeFoto.textContent = 'Nenhuma foto selecionada';
      txtNomeFoto.style.color = '#64748b';
    }
    formularioCadastrarPet.reset();

    fecharModal();
    renderizarPetsPerfil();
    atualizarEstatisticas();
    });
  }
});

function atualizarEstatisticas() {
    const usuarioLogado = JSON.parse(localStorage.getItem('laco_usuario_logado'));
    if (!usuarioLogado) return;

    const petsSalvos = JSON.parse(localStorage.getItem('laco_pets')) || [];
    const meusPets = petsSalvos.filter(pet => pet.donoEmail === usuarioLogado.email);

    const publicados = meusPets.length;
    const disponiveis = meusPets.filter(pet => pet.status !== 'adotado').length;
    const adotados = meusPets.filter(pet => pet.status === 'adotado').length;

    const elementosNumeros = document.querySelectorAll('.container-estatisticas .numero-estatistica');

    if (elementosNumeros.length >= 3) {
      elementosNumeros[0].textContent = publicados;
      elementosNumeros[1].textContent = disponiveis;
      elementosNumeros[2].textContent = adotados;
    }
  }




/* Variável global para guardar a URL da foto enviada pelo Cloudinary */
let urlFotoPet = '';

/* Configuração do Cloudinary Upload Widget para envio de fotos */
const btnUploadFoto = document.getElementById('btn-upload-foto');
const txtNomeFoto = document.getElementById('nome-foto-selecionada');

if (btnUploadFoto) {
  /* Cria o widget de upload do Cloudinary */
  const meuWidget = cloudinary.createUploadWidget(
    {
      cloudName: 'rwanooli',
      uploadPreset: 'meu_preset_js', 
      sources: ['local', 'url', 'camera'],
      multiple: false,
      maxFiles: 1,
      clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
      language: 'pt',
      text: {
        pt: {
          or: 'ou',
          back: 'Voltar',
          close: 'Fechar',
          menu: {
            files: 'Meus Ficheiros',
            web: 'Endereço Web',
            camera: 'Câmera'
          },
          local: {
            browse: 'Escolher ficheiro',
            dd_title: 'Arraste e solte a imagem aqui'
          }
        }
      }
    },
    (error, result) => {
      if (!error && result && result.event === 'success') {
        /* Guarda a URL segura gerada pelo Cloudinary */
        urlFotoPet = result.info.secure_url;

        /* Atualiza a interface do modal indicando o envio com sucesso */
        if (txtNomeFoto) {
          txtNomeFoto.textContent = '✅ Foto enviada com sucesso!';
          txtNomeFoto.style.color = '#10b981';
        }
      }
    }
  );

  btnUploadFoto.addEventListener('click', () => {
    meuWidget.open();
  });
}