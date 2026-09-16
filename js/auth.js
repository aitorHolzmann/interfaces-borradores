/* ==========================================================================
   LÓGICA DE AUTENTICACIÓN — LOGIN Y REGISTRO
   Alternancia de formularios, cambio de fondo y visor de contraseña
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const formLogin = document.getElementById('form-login');
  const formRegistro = document.getElementById('form-registro');
  const linkIrRegistro = document.getElementById('link-ir-registro');
  const linkIrLogin = document.getElementById('link-ir-login');
  const authTitulo = document.getElementById('auth-titulo');
  const authSeccion = document.getElementById('auth-seccion');

  // Alternar a Modo Registro
  if (linkIrRegistro) {
    linkIrRegistro.addEventListener('click', (e) => {
      e.preventDefault();
      formLogin.classList.add('oculto');
      formRegistro.classList.remove('oculto');
      if (authTitulo) authTitulo.innerHTML = 'Registrate<br>Soldado!';
      if (authSeccion) {
        authSeccion.classList.remove('modo-login');
        authSeccion.classList.add('modo-registro');
      }
    });
  }

  // Alternar a Modo Login
  if (linkIrLogin) {
    linkIrLogin.addEventListener('click', (e) => {
      e.preventDefault();
      formRegistro.classList.add('oculto');
      formLogin.classList.remove('oculto');
      if (authTitulo) authTitulo.innerHTML = 'Inicia<br>Soldado!';
      if (authSeccion) {
        authSeccion.classList.remove('modo-registro');
        authSeccion.classList.add('modo-login');
      }
    });
  }

  // Toggle de visibilidad de contraseña
  const toggleButtons = document.querySelectorAll('.btn-toggle-password');
  toggleButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (!input) return;

      if (input.type === 'password') {
        input.type = 'text';
      } else {
        input.type = 'password';
      }
    });
  });
});
