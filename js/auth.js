/* LOGICA DE AUTENTICACION LOGIN Y REGISTRO ALTERNANCIA DE FORMULARIOS CAMBIO DE FONDO Y VISOR DE CONTRASENA */

document.addEventListener('DOMContentLoaded', () => {
  const formLogin = document.getElementById('form-login');
  const formRegistro = document.getElementById('form-registro');
  const linkIrRegistro = document.getElementById('link-ir-registro');
  const linkIrLogin = document.getElementById('link-ir-login');
  const authTitulo = document.getElementById('auth-titulo');
  const authSeccion = document.getElementById('auth-seccion');

  // --- 1. Alternancia entre Modo Login y Modo Registro ---
  function cambiarModo(esRegistro) {
    if (!formLogin || !formRegistro) return;

    if (esRegistro) {
      formLogin.classList.add('oculto');
      formRegistro.classList.remove('oculto');
      if (authTitulo) authTitulo.innerHTML = 'Registrate<br>Soldado!';
      if (authSeccion) {
        authSeccion.classList.remove('modo-login');
        authSeccion.classList.add('modo-registro');
      }
    } else {
      formRegistro.classList.add('oculto');
      formLogin.classList.remove('oculto');
      if (authTitulo) authTitulo.innerHTML = 'Inicia<br>Soldado!';
      if (authSeccion) {
        authSeccion.classList.remove('modo-registro');
        authSeccion.classList.add('modo-login');
      }
    }
  }

  if (linkIrRegistro) {
    linkIrRegistro.addEventListener('click', (e) => {
      e.preventDefault();
      cambiarModo(true);
    });
  }

  if (linkIrLogin) {
    linkIrLogin.addEventListener('click', (e) => {
      e.preventDefault();
      cambiarModo(false);
    });
  }

  // Comprobar si la URL viene con hash #registro o query param
  function aplicarModoSegunUrl() {
    const esRegistro = window.location.hash === '#registro' || window.location.search.includes('registro');
    if (esRegistro) {
      cambiarModo(true);
    } else if (window.location.hash === '#login' || window.location.search.includes('login')) {
      cambiarModo(false);
    }
  }

  aplicarModoSegunUrl();
  window.addEventListener('hashchange', aplicarModoSegunUrl);

  // --- 2. Visibilidad de Contraseñas ---
  const toggleButtons = document.querySelectorAll('.btn-toggle-password');
  toggleButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (!input) return;

      const mostrar = input.type === 'password';
      input.type = mostrar ? 'text' : 'password';

      const img = btn.querySelector('img');
      if (img) {
        img.src = mostrar ? 'assets/icons/icon-eye.svg' : 'assets/icons/icon-eye-off.svg';
        img.alt = mostrar ? 'Ocultar contraseña' : 'Ver contraseña';
      }
      btn.setAttribute('aria-label', mostrar ? 'Ocultar contraseña' : 'Mostrar contraseña');

      if (input.dataset.tocado === 'true') {
        validarInput(input);
      }
    });
  });

  // --- 3. Validación de Campos en Tiempo Real ---
  const inputs = document.querySelectorAll('.panel-auth input:not([type="checkbox"])');

  const validarInput = (input) => {
    let esValido = false;
    const esCampoPassword = input.type === 'password' || input.id.includes('password');

    if (input.type === 'email') {
      esValido = input.validity.valid && input.value.includes('.') && input.value.includes('@');
    } else if (esCampoPassword) {
      esValido = input.value.length >= 8;

      if (input.id === 'reg-password-repeat') {
        const pass = document.getElementById('reg-password').value;
        esValido = input.value.length >= 8 && input.value === pass;
      }

      if (input.id === 'reg-password') {
        const passRepeat = document.getElementById('reg-password-repeat');
        if (passRepeat && passRepeat.value.length > 0) {
          validarInput(passRepeat);
        }
      }
    } else if (input.type === 'number' && input.id === 'reg-edad') {
      const edad = parseInt(input.value, 10);
      esValido = !isNaN(edad) && edad >= 13 && edad <= 99;
    } else if (input.id === 'reg-usuario') {
      esValido = true;
    } else {
      esValido = input.value.trim() !== '';
    }

    const contenedor = input.closest('div:not(.campo-password)') || input.parentElement;
    const msgError = contenedor ? contenedor.querySelector('.msg-error') : null;

    if (esValido) {
      input.classList.add('input-valido');
      input.classList.remove('input-invalido');
      if (msgError) msgError.classList.remove('visible');
    } else {
      input.classList.remove('input-valido');
      if (input.dataset.tocado === 'true') {
        input.classList.add('input-invalido');
        if (msgError) msgError.classList.add('visible');
      } else {
        if (msgError) msgError.classList.remove('visible');
      }
    }

    return esValido;
  };

  inputs.forEach((input) => {
    input.addEventListener('input', () => validarInput(input));
    input.addEventListener('blur', () => {
      input.dataset.tocado = 'true';
      validarInput(input);
    });
  });

  // --- 4. Envío y Confirmación de Éxito ---
  const manejarSubmit = (e, form) => {
    e.preventDefault();

    const formInputs = form.querySelectorAll('input:not([type="checkbox"])');
    let formValido = true;

    formInputs.forEach((input) => {
      input.dataset.tocado = 'true';
      if (!validarInput(input)) {
        formValido = false;
      }
    });

    const checkboxes = form.querySelectorAll('input[type="checkbox"][required]');
    checkboxes.forEach((chk) => {
      if (!chk.checked) formValido = false;
    });

    if (formValido) {
      const panelAuth = form.closest('.panel-auth');
      const overlayExito = panelAuth ? panelAuth.querySelector('.overlay-exito') : null;
      const marcaExito = panelAuth ? panelAuth.querySelector('.marca-exito') : null;
      if (!overlayExito || !marcaExito || overlayExito.classList.contains('visible')) return;

      overlayExito.classList.add('visible');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => marcaExito.classList.add('dibujada'));
      });

      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);
    }
  };

  if (formLogin) {
    formLogin.addEventListener('submit', (e) => manejarSubmit(e, formLogin));
  }
  if (formRegistro) {
    formRegistro.addEventListener('submit', (e) => manejarSubmit(e, formRegistro));
  }
});
