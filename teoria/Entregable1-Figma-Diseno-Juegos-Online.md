# Ejercicio Entregable Nº 1: Proceso de Diseño de Interfaz de Usuario (Figma)

> **Materia:** Interfaces de Usuario e Interacción (TUDAI / UNCPBA)  
> **Fuente original:** `Ejercicio Entregable Nº1 - Figma (1).pdf` (5 páginas)  
> **Objetivo:** Especificación técnica completa, estructurada y optimizada para modelos de lenguaje (IA) sobre los requerimientos, diseño atómico, bitácora de IA y prototipado interactivo de la plataforma de juegos online.

---

## 1. Alcance General y Objetivo del Proyecto

Diseño de una plataforma web de **Juegos Online** (temática a elección del grupo, inspirada en plataformas como *1001juegos*, *Minijuegos*, *Poki*, *JuegosDiarios*, *Cartoon Network Juegos*).

![Inspiración de Plataformas de Juegos](images/tpe1_referencia_sitios_juegos.png)

### Entregable Mandatorio
- Prototipo interactivo navegable en **alta fidelidad** utilizando **Figma** (exclusivamente para resolución **Desktop**).
- El prototipo debe ser navegable y respetar la solicitud del cliente de forma estricta.

---

## 2. Design System y Atomic Design (Mandatorio)

Se debe construir un **Design System** formal dentro de Figma aplicando la metodología de **Atomic Design** de Brad Frost:

1. **Paleta Cromática (Átomos):**
   - Color Primario.
   - Color Secundario.
   - Color de Acento.
   - Para cada color definido, generar un rango mínimo de **3 luces (tints) y 3 sombras (shades)**.
2. **Cards de Juegos (Moléculas / Componentes base):**
   - Componente reutilizable que incluya miniatura/portada del juego, título real, etiquetas o categoría, y elementos de estado.
3. **Carrusel de Juegos (Organismos):**
   - Estructura horizontal compuesta a partir de instancias del componente Card anterior.
   - Las cards deben contener imágenes y títulos variados (prohibido repetir la misma card).
4. **Botones y Estados (Variantes de Componente):**
   - Componente maestro con variantes para: `Default`, `Hover`, `Pressed/Active`, `Disabled`.
   - Los efectos de *hover* deben estar prototipados interactivamente dentro del propio componente de Figma.
5. **Tipografía:**
   - Si se define una tipografía distintiva para el logotipo, **solo se utiliza en el logotipo**. Jamás debe reutilizarse para títulos `H1`, `H2` o texto de interfaz (principio de identidad de marca).

---

## 3. Integración Mandatoria de Inteligencia Artificial ("Bitácora de IA")

El proyecto exige el uso asistido de herramientas de IA (ChatGPT, Claude, GalileoAI, Uizard, Diagram) para la concepción y validación del diseño:

### Requisitos de la Bitácora
- Puede documentarse en un archivo complementario o en una sección dedicada del archivo de Figma.
- **Comparativa Visual Antes vs. Después:** Guardar capturas de las versiones preliminares y las versiones finales tras la intervención/sugerencia de la IA, justificando por qué se tomó cada decisión de cambio.
- **Validación Heurística y Teórica:** Utilizar la IA para auditar la interfaz frente a las **Leyes de UX**, principios de la **Gestalt** y ratios de contraste de la paleta cromática.
- > [!CAUTION]
  > **Restricción Estricta:** Queda terminantemente prohibido generar el Design System completo desde cero mediante IA generativa. El criterio, selección y estructuración deben ser autoría del alumno y luego validados o iterados con IA.

---

## 4. Especificación Detallada de las 3 Páginas Obligatorias

El flujo de interacción del prototipo debe conectar estas 3 páginas:

```
[Página 1: Registro/Login] ──(botón)──> [Página 2: Home] ──(card)──> [Página 3: Peg Solitaire]
```

### 4.1. Página 1: Registración y Autenticación (Login)
- Es la **pantalla de entrada inicial** del prototipo en modo presentación de Figma.
- **Layout:** Formulario contenido dentro de un recuadro/card central claramente destacado del fondo.
- **Modo Dual (Registro / Login):** Mecanismo para alternar fácilmente entre formulario de Registro y formulario de Login (este último solo pide Mail y Contraseña).
- **Social Login:** Botones de autenticación directa con proveedores terceros (Google y Facebook).
- **Campos del Formulario de Registro:**
  1. Nombre y Apellido.
  2. Nickname (campo opcional).
  3. Edad.
  4. Correo Electrónico (Mail).
  5. Contraseña.
  6. Repetir Contraseña.
  7. Casilla de verificación Recaptcha (diseñada visualmente, no funcional).
- **Interacción:** El botón principal ("Registrarse" o "Iniciar Sesión") conduce a la **Página 2 (Home)**.

### 4.2. Página 2: Home (Portal de Juegos)
- **Header:** Logotipo de la plataforma y barra de navegación superior.
- **Menú Hamburguesa / Perfil:** Asumir estado de usuario autenticado; debe mostrar accesos a perfil, redes sociales y configuración.
- **Sección de Recomendaciones:** Sugerencias personalizadas basadas en el usuario.
- **Catálogo de Juegos:** Carruseles horizontales clasificados por categorías temáticas (ej. Acción, Aventura, Estrategia). Cada card debe poseer portadas y títulos distintos.
- **Fat Footer:** Pie de página amplio con secciones institucionales, mapa del sitio, enlaces de ayuda, términos legales y redes sociales.
- **Interacción:** Al hacer clic sobre la card correspondiente al juego **"Peg Solitaire"**, se navega a la **Página 3**.

### 4.3. Página 3: Ejecución de Juego ("Peg Solitaire" Temático)
![Layout Juego en Ejecución](images/tpe1_layout_juego_ejecucion.png)

- **Temática Personalizada:** El juego base debe ser el "Peg Solitaire", pero **adaptado a una temática narrativa** (ej. *Batman*, *Los Simpson*, *Cyberpunk*, *Fantasía Medieval*). Queda prohibido el Peg Solitaire clásico de clavijas de madera neutras.
- **Área de Ejecución:** Espacio contenedor prominente donde se alojará el juego interactivo (preparado para la implementación técnica posterior).
- **Controles en Ejecución:**
  - Botón visible para **regresar a la página principal** (Home) en cualquier momento.
  - Menú accesible de **ayuda / instrucciones de juego** visible mientras se juega.
- **Navegación Breadcrumbs (Migas de Pan):** Indicador de ruta jerárquica (ej. `Mis Juegos > Lógica > Peg Solitaire Batman Edition`).
- **Ficha Multimedia del Juego:**
  - Galería de imágenes / capturas.
  - Textos descriptivos e historia de la temática.
  - Videos o tráilers embebidos.
  - Enlaces de interés.
- **Funciones Sociales:**
  - Sección de Comunidad / Foro con formulario de comentarios y valoraciones/reseñas.
  - Botones de acción para compartir en redes sociales, correo electrónico y mensajería.

---

## 5. Fundamentación Teórica y Preguntas de Defensa Oral

La cátedra evaluará las defensas orales exigiendo **justificación estricta en base a la teoría** (heurísticas de Nielsen, leyes de UX, leyes de Gestalt). Las opiniones subjetivas no fundamentadas restan puntos conceptuales.

### Preguntas Estratégicas de Negocio a Resolver
1. **Modelo de Negocio:** ¿Cómo monetiza la plataforma? (Publicidad, suscripciones premium, compras dentro del juego).
2. **Acceso y Precios:** ¿Existen juegos 100% gratuitos y otros de pago? ¿Cómo se comunica visualmente esta distinción en las cards de la Home?
3. **Flujo Transaccional:** Si hay juegos pagos, ¿cómo se adquieren? ¿Se implementa un carrito de compras (*checkout flow*) o compra en un clic? ¿Dónde y cómo se muestran los precios?

---

## 6. Restricciones y Reglas de Diseño

- **Prohibido Lorem Ipsum:** Todos los textos, nombres de juegos, descripciones y comentarios deben ser reales y coherentes.
- **Variabilidad de Datos:** Probar títulos de diferente longitud (cortos de 1 palabra vs largos de varias líneas) para validar la robustez de los contenedores.
- **Alineación y Proximidad:** Rigurosa aplicación de las leyes de Gestalt para evitar ambigüedades espaciales entre títulos, cards y botones.
- **Permisos en Figma:** El archivo debe tener permisos públicos de visualización habilitados para que los evaluadores accedan sin requerir login en Figma.

---

## 7. Condiciones de Entrega

- **Modalidad:** Grupal (2 estudiantes).
- **Canal de Entrega:** Rama `gh-pages` en repositorio GitHub con un archivo `index.html` simple que proporcione los accesos directos a:
  1. Enlace a Figma en **Modo Editor** (para evaluar el Design System y componentes).
  2. Enlace a Figma en **Modo Presentación / Prototipo Interactivo** (con el flujo `Registro -> Home -> Peg Solitaire`).

