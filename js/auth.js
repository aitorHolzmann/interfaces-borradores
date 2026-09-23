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

  // ==========================================================================
  // VALIDACIÓN Y ENVÍO DE FORMULARIOS
  // ==========================================================================

  const inputs = document.querySelectorAll('.input-formulario');

  const validarInput = (input) => {
    let esValido = false;
    
    // Reglas de validación simples
    if (input.type === 'email') {
      esValido = input.validity.valid && input.value.includes('.') && input.value.includes('@');
    } else if (input.type === 'password') {
      esValido = input.value.length >= 8;
      // Comprobar coincidencia si es repetir contraseña
      if (input.id === 'reg-password-repeat') {
        const pass = document.getElementById('reg-password').value;
        esValido = input.value.length >= 8 && input.value === pass;
      }
      // Actualizar el de repetir si cambia el original
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
      // Nombre, Apellido, Usuario (texto genérico)
      esValido = input.value.trim() !== '';
    }

    // Aplicar clases visuales
    if (esValido) {
      input.classList.add('input-valido');
      input.classList.remove('input-invalido');
    } else {
      input.classList.remove('input-valido');
      // Solo marcar inválido si ya fue tocado (blur)
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
    
    // Forzar validación en todos los inputs del form
    const formInputs = form.querySelectorAll('.input-formulario');
    let formValido = true;
    
    formInputs.forEach(input => {
      input.dataset.tocado = 'true';
      if (!validarInput(input)) {
        formValido = false;
      }
    });

    // Checkbox de términos y recaptcha (solo en registro)
    const checkboxes = form.querySelectorAll('input[type="checkbox"][required]');
    checkboxes.forEach(chk => {
      if (!chk.checked) formValido = false;
    });

    if (formValido) {
      // Crear mensaje de éxito
      const mensajeExito = document.createElement('div');
      mensajeExito.className = 'mensaje-exito';
      mensajeExito.textContent = mensaje;
      
      const panelAuth = document.getElementById('panel-autenticacion');
      panelAuth.appendChild(mensajeExito);

      // Redirigir después de 2 segundos
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
