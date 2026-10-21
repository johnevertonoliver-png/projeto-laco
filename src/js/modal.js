export function abrirModalDetalhes(pet) {
  const modal = document.getElementById('modal-detalhes-pet');
  if (!modal) return;

  document.getElementById('modal-pet-foto').src = pet.foto;
  document.getElementById('modal-pet-nome').textContent = pet.nome;
  document.getElementById('modal-pet-sub-raca-idade').textContent = `${pet.raca} · ${pet.idade}`;
  document.getElementById('modal-pet-sobre').textContent = pet.sobre;
  document.getElementById('modal-pet-sexo').textContent = pet.sexo;
  document.getElementById('modal-pet-porte').textContent = pet.porte;
  document.getElementById('modal-pet-idade').textContent = pet.idade;
  document.getElementById('modal-pet-cidade').textContent = pet.cidade;

  modal.style.display = 'flex';
  modal.classList.add('ativo');
}

document.addEventListener('DOMContentLoaded', () => {
  const modalDetalhes = document.getElementById('modal-detalhes-pet');
  const btnFecharDetalhes = document.getElementById('botao-fechar-detalhes');

  if (btnFecharDetalhes && modalDetalhes) {
    btnFecharDetalhes.addEventListener('click', () => {
      modalDetalhes.style.display = 'none';
    });

    modalDetalhes.addEventListener('click', (e) => {
      if (e.target === modalDetalhes) {
        modalDetalhes.style.display = 'none';
      }
    });
  }
});

const btnQueroAdotar = document.getElementById('modal-btn-quero-adotar');
if (btnQueroAdotar) {
  btnQueroAdotar.addEventListener('click', () => {
    window.open('https://wa.me/', '_blank');
  });
}