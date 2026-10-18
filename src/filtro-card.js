document.addEventListener('DOMContentLoaded', () => {
  
  const gridPets = document.getElementById('grid-pets');
  const botoesFiltro = document.querySelectorAll('.filtro-btn');
  const inputPesquisa = document.getElementById('input-pesquisa');
  const selectIdade = document.getElementById('select-idade');

  let especieSelecionada = 'todos'; 

  /* ler direto do localstorage */
  const listaPets = JSON.parse(localStorage.getItem('laco_pets')) || [];

  function renderizarPets(pets) {
    gridPets.innerHTML = '';

    if (pets.length === 0) {
      gridPets.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: #718096; padding: 2rem;">Nenhum pet cadastrado ou encontrado com esses filtros.</p>';
      return;
    }

    pets.forEach(pet => {
      const card = document.createElement('div');
      card.classList.add('card-pet');

      const statusAtual = pet.status || 'disponivel';

      /* usuário logado e verificação de favoritos */
      const usuarioLogado = JSON.parse(localStorage.getItem('laco_usuario_logado'));
      const emailUsuario = usuarioLogado ? usuarioLogado.email : 'desconhecido';
      const chaveFavoritos = `laco_favoritos_${emailUsuario}`;

      const favoritosSalvos = JSON.parse(localStorage.getItem(chaveFavoritos)) || [];
      const jaFavoritado = favoritosSalvos.includes(pet.id);

      const classeCoracao = jaFavoritado ? 'favorito' : '';
      const iconeCoracao = jaFavoritado ? '&#9829;' : '&#9825;';

      card.innerHTML = `
        <div class="card-imagem-wrapper">
          <span class="badge-disponivel ${statusAtual}">${statusAtual === 'adotado' ? 'ADOTADO' : 'DISPONÍVEL'}</span>
          <button class="btn-favoritar ${classeCoracao}" data-id="${pet.id}" aria-label="Favoritar pet">${iconeCoracao}</button>
          <img src="${pet.foto}" alt="${pet.nome}" class="card-img" />
        </div>
        <div class="card-conteudo">
          <div class="card-info-topo">
            <h3 class="card-nome">${pet.nome}</h3>
            <span class="card-idade">${pet.idade}</span>
          </div>
          <div class="card-info-detalhes">
            <span class="detalhe-item">🐾 ${pet.especie}</span>
            <span class="detalhe-item">📍 ${pet.cidade}</span>
          </div>
          <div class="card-divisor"></div>
          <a href="#" class="card-link">Quero conhecer &rarr;</a>
        </div>
      `;

      // Evento do botão favoritar
      const botaoFavoritar = card.querySelector('.btn-favoritar');
      botaoFavoritar.addEventListener('click', () => {
        if (!usuarioLogado) {
          alert('Você precisa estar logado para favoritar pets!');
          window.location.href = 'login.html';
          return;
        }

        const idPet = pet.id;
        let favoritos = JSON.parse(localStorage.getItem(chaveFavoritos)) || [];

        if (favoritos.includes(idPet)) {
          favoritos = favoritos.filter(id => id !== idPet);
          botaoFavoritar.classList.remove('favorito');
          botaoFavoritar.innerHTML = '&#9825;';
        } else {
          favoritos.push(idPet);
          botaoFavoritar.classList.add('favorito');
          botaoFavoritar.innerHTML = '&#9829;';
        }

        localStorage.setItem(chaveFavoritos, JSON.stringify(favoritos));
      });

      gridPets.appendChild(card);
    });
  }


  /* funções de filtragem */

  function filtrarPorEspecie(pet) {
    if (especieSelecionada === 'todos') return true;
    return pet.especie.toLowerCase() === especieSelecionada.toLowerCase();
  }

  function filtrarPorTexto(pet) {
    const termoBusca = inputPesquisa.value.toLowerCase().trim();
    if (!termoBusca) return true; 

    const coincideNome = pet.nome.toLowerCase().includes(termoBusca);
    const coincideCidade = pet.cidade.toLowerCase().includes(termoBusca);

    return coincideNome || coincideCidade;
  }


  function filtrarPorIdade(pet) {
    const faixaIdade = selectIdade.value;
    if (!faixaIdade) return true; 

    if (faixaIdade === 'filhote') {
      return pet.idade.toLowerCase().includes('meses') || (parseInt(pet.idade) < 1);
    } else if (faixaIdade === 'adulto') {
      const anos = parseInt(pet.idade);
      return !pet.idade.toLowerCase().includes('meses') && anos >= 1 && anos <= 5;
    } else if (faixaIdade === 'idoso') {
      const anos = parseInt(pet.idade);
      return !pet.idade.toLowerCase().includes('meses') && anos > 5;
    }

    return true;
  }


  /* função principal que junta as 3 */
  function atualizarFiltros() {
    const petsFiltrados = listaPets.filter(pet => {
      return filtrarPorEspecie(pet) && filtrarPorTexto(pet) && filtrarPorIdade(pet);
    });
    renderizarPets(petsFiltrados);
  }


  /* botões de espécie */
  botoesFiltro.forEach(botao => {
    botao.addEventListener('click', () => {
      botoesFiltro.forEach(b => b.classList.remove('ativo'));
      botao.classList.add('ativo');

      especieSelecionada = botao.getAttribute('data-especie');
      atualizarFiltros(); 
    });
  });


  inputPesquisa.addEventListener('input', atualizarFiltros);

  selectIdade.addEventListener('change', atualizarFiltros);


  /* quando a pagina é inicializada */
  if (botoesFiltro.length > 0) {
    botoesFiltro[0].classList.add('ativo'); /* deixa o botão "todos" com estilo ativo */
  }
  
  renderizarPets(listaPets); 
});