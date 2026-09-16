/* ==========================================================================
   LÓGICA DE AUTENTICACIÓN — LOGIN Y REGISTRO
   Alternancia de formularios y visor de contraseña (base Etapa 1)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const formLogin = document.getElementById('form-login');
  const formRegistro = document.getElementById('form-registro');
  const linkIrRegistro = document.getElementById('link-ir-registro');
  const linkIrLogin = document.getElementById('link-ir-login');
  const authTitulo = document.getElementById('auth-titulo');
  const authSubtitulo = document.getElementById('auth-subtitulo');

  // Alternar a Registro
  if (linkIrRegistro) {
    linkIrRegistro.addEventListener('click', (e) => {
      e.preventDefault();
      formLogin.classList.add('oculto');
      formRegistro.classList.remove('oculto');
      authTitulo.textContent = 'Crear Cuenta';
      authSubtitulo.textContent = 'Únete al frente de batalla registrando tus datos';
    });
  }

  // Alternar a Login
  if (linkIrLogin) {
    linkIrLogin.addEventListener('click', (e) => {
      e.preventDefault();
      formRegistro.classList.add('oculto');
      formLogin.classList.remove('oculto');
      authTitulo.textContent = 'Iniciar Sesión';
      authSubtitulo.textContent = 'Identifícate soldado para acceder al catálogo';
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
        btn.style.opacity = '1';
      } else {
        input.type = 'password';
        btn.style.opacity = '0.7';
      }
    });
  });
});

