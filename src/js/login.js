document.addEventListener('DOMContentLoaded', () => {
  const formLogin = document.getElementById('form-login');

  if (formLogin) {
    formLogin.addEventListener('submit', (evento) => {
      evento.preventDefault();

      const email = document.getElementById('email').value.trim();
      const senha = document.getElementById('senha').value.trim();

      if (!email || !senha) {
        alert('Por favor, preencha todos os campos.');
        return;
      }

      const utilizadoresGuardados = localStorage.getItem('laco_utilizadores');
      
      if (!utilizadoresGuardados) {
        alert('Nenhuma conta encontrada. Faça o cadastro primeiro.');
        return;
      }

      const utilizadores = JSON.parse(utilizadoresGuardados);

      const utilizadorEncontrado = utilizadores.find(
        user => user.email === email && user.senha === senha
      );

    
      if (!utilizadorEncontrado) {
        alert('E-mail ou senha incorretos.');
        return;
      }

      localStorage.setItem('laco_usuario_logado', JSON.stringify(utilizadorEncontrado));

      alert('Login efetuado com sucesso!');
    
      window.location.href = 'index.html'; 
    });
  }
});