/* LOGICA DE AUTENTICACION LOGIN Y REGISTRO ALTERNANCIA DE FORMULARIOS CAMBIO DE FONDO Y VISOR DE CONTRASENA */

document.addEventListener('DOMContentLoaded', () => {
  const formLogin = document.getElementById('form-login');
  const formRegistro = document.getElementById('form-registro');
  const linkIrRegistro = document.getElementById('link-ir-registro');
  const linkIrLogin = document.getElementById('link-ir-login');
  const authTitulo = document.getElementById('auth-titulo');
  const authSeccion = document.getElementById('auth-seccion');

  // ALTERNAR A MODO REGISTRO
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

  // ALTERNAR A MODO LOGIN
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

  // COMPROBACION DE PARAMETRO EN URL O HASH EJ LOGIN HTML MODO REGISTRO O REGISTRO
  function aplicarModoSegunUrl() {
    const esRegistro = window.location.hash === '#registro' || window.location.search.includes('registro');
    const esLogin = window.location.hash === '#login' || window.location.search.includes('login');

    if (esRegistro && linkIrRegistro) {
      formLogin.classList.add('oculto');
      formRegistro.classList.remove('oculto');
      if (authTitulo) authTitulo.innerHTML = 'Registrate<br>Soldado!';
      if (authSeccion) {
        authSeccion.classList.remove('modo-login');
        authSeccion.classList.add('modo-registro');
      }
    } else if (esLogin && linkIrLogin) {
      formRegistro.classList.add('oculto');
      formLogin.classList.remove('oculto');
      if (authTitulo) authTitulo.innerHTML = 'Inicia<br>Soldado!';
      if (authSeccion) {
        authSeccion.classList.remove('modo-registro');
        authSeccion.classList.add('modo-login');
      }
    }
  }

  aplicarModoSegunUrl();
  window.addEventListener('hashchange', aplicarModoSegunUrl);

  // TOGGLE DE VISIBILIDAD DE CONTRASENA
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

  // 
  // VALIDACION Y ENVIO DE FORMULARIOS
  // 

  const inputs = document.querySelectorAll('form input:not([type="checkbox"])');

  const validarInput = (input) => {
    let esValido = false;
    
    // REGLAS DE VALIDACION SIMPLES
    if (input.type === 'email') {
      esValido = input.validity.valid && input.value.includes('.') && input.value.includes('@');
    } else if (input.type === 'password') {
      esValido = input.value.length >= 8;
      // COMPROBAR COINCIDENCIA SI ES REPETIR CONTRASENA
      if (input.id === 'reg-password-repeat') {
        const pass = document.getElementById('reg-password').value;
        esValido = input.value.length >= 8 && input.value === pass;
      }
      // ACTUALIZAR EL DE REPETIR SI CAMBIA EL ORIGINAL
      if (input.id === 'reg-password') {
        const passRepeat = document.getElementById('reg-password-repeat');
        if (passRepeat && passRepeat.value.length > 0) {
          validarInput(passRepeat);
        }
      }
    } else if (input.type === 'number' && input.id === 'reg-edad') {
      const edad = parseInt(input.value);
      esValido = edad >= 13 && edad <= 99;
    } else {
      // NOMBRE APELLIDO USUARIO TEXTO GENERICO
      esValido = input.value.trim() !== '';
    }

    // APLICAR CLASES VISUALES
    if (esValido) {
      input.classList.add('input-valido');
      input.classList.remove('input-invalido');
    } else {
      input.classList.remove('input-valido');
      // SOLO MARCAR INVALIDO SI YA FUE TOCADO BLUR
      if (input.dataset.tocado === 'true') {
        input.classList.add('input-invalido');
      }
    }
    
    return esValido;
  };

  inputs.forEach(input => {
    input.addEventListener('input', () => {
      validarInput(input);
    });

    input.addEventListener('blur', () => {
      input.dataset.tocado = 'true';
      validarInput(input);
    });
  });

  const manejarSubmit = (e, form, mensaje) => {
    e.preventDefault();
    
    // FORZAR VALIDACION EN TODOS LOS INPUTS DEL FORM
    const formInputs = form.querySelectorAll('.input-formulario');
    let formValido = true;
    
    formInputs.forEach(input => {
      input.dataset.tocado = 'true';
      if (!validarInput(input)) {
        formValido = false;
      }
    });

    // CHECKBOX DE TERMINOS Y RECAPTCHA SOLO EN REGISTRO
    const checkboxes = form.querySelectorAll('input[type="checkbox"][required]');
    checkboxes.forEach(chk => {
      if (!chk.checked) formValido = false;
    });

    if (formValido) {
      // CREAR MENSAJE DE EXITO
      const mensajeExito = document.createElement('div');
      mensajeExito.className = 'mensaje-exito';
      mensajeExito.textContent = mensaje;
      
      const panelAuth = document.getElementById('panel-autenticacion');
      panelAuth.appendChild(mensajeExito);

      // REDIRIGIR DESPUES DE SEGUNDOS
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 2000);
    }
  };

  if (formLogin) {
    formLogin.addEventListener('submit', (e) => manejarSubmit(e, formLogin, '¡Bienvenido de vuelta, soldado!'));
  }
  if (formRegistro) {
    formRegistro.addEventListener('submit', (e) => manejarSubmit(e, formRegistro, '¡Registro exitoso, soldado!'));
  }
});
