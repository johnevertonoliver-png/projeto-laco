document.addEventListener('DOMContentLoaded', () => {
  const formCadastro = document.getElementById('form-cadastro');

  if (formCadastro) {
    formCadastro.addEventListener('submit', (evento) => {
      evento.preventDefault(); 

      const nome = document.getElementById('nome').value.trim();
      const email = document.getElementById('email').value.trim();
      const senha = document.getElementById('senha').value.trim();

      if (!nome || !email || !senha) {
        alert('Por favor, preencha todos os campos.');
        return;
      }
      
      if (senha.length < 8) {
        alert('A senha deve ter pelo menos 8 caracteres.');
        return;
      }

      const utilizadoresGuardados = localStorage.getItem('laco_utilizadores');
      const utilizadores = utilizadoresGuardados ? JSON.parse(utilizadoresGuardados) : [];

      const utilizadorExistente = utilizadores.find(user => user.email === email);

      if (utilizadorExistente) {
        alert('Este e-mail já está cadastrado. Tente fazer login ou use outro e-mail.');
        return;
      }

      const novoUtilizador = {
        nome: nome,
        email: email,
        senha: senha 
      };

      utilizadores.push(novoUtilizador);
      
      localStorage.setItem('laco_utilizadores', JSON.stringify(utilizadores));

      alert('Conta criada com sucesso, faça login para continuar.');
      
      window.location.href = 'login.html'; 
    });
  }
});