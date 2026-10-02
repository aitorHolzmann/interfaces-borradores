# **Ejercicio Entregable Nº3**

**Videojuego BLOCKA**  
Blocka es un juego de rompecabezas basado en imágenes.  
Al iniciar el nivel, la blocka aparece en pantalla con una interfaz limpia.  
Una blocka es una imagen descompuesta en cuatro partes las cuales están rotadas respecto a su posición original. El usuario debe rotar cada subimagen de la blocka hasta que las cuatro partes estén de forma correcta y conformen la imagen final. 

Para rotar la subimagen, el usuario clickea en ella: si lo hace con el botón derecho la imagen gira hacia la derecha, en cambio si el usuario clickea con el botón izquierdo la imagen gira hacia el lado izquierdo.. 

El nivel muestra un temporizador que se inicia cuando el usuario elige la opción de “Comenzar” y cuando se logra la imagen final, el temporizador se detiene, marcando el récord para ese nivel.  
Luego  de ello, el usuario puede volver al Menú Ppal o continuar al siguiente nivel, el cual tiene la misma mecánica pero con otra imagen.  
Para incrementar la dificultad, la imagen aparece desordenada y con un filtro aplicado. A medida que pasan los niveles, el filtro cambia e incluso puede ser que cada subimagen tenga un filtro distinto. Cuando el usuario termina de armar la imagen, los filtros se quitan y se puede observar la imagen original en RGB.

**Funcionalidad general:**

1. Los filtros son aplicados en tiempo de carga, en el momento de setup del nivel  
2. Existe un banco de imágenes (6 o más) y en el momento de iniciar el nivel, el sistema elige aleatoriamente una imagen   
3. Incluir instrucciones de juego. Elegir la posición, forma de acceso, etc acorde a la mejor UX.  
4. El videojuego debe contener al menos tres niveles. Utilizar los filtros:   
   1. Escala de grises  
   2. Brillo (30%)  
   3. Negativo.  
5. El juego debe tener una página propia similar a la que hicieron para el “Peg Solitaire” en TPE2  (mismo diseño) y ejecutar sobre la entrega del TPE2. En la entrega TPE4 realizaran  el “Peg Solitaire”.  
   1. Tener lugar de ejecución visible  
   2. Agregar instrucciones del juego  
   3. Agregar imágenes representativas del juevo

Nota: Todos los puntos son obligatorios para aprobar.

**Extras:** 

1. Previo a iniciar el nivel se muestran todas las imágenes (thumbnail) y mediante una animación se muestra con cuál imagen  se jugará el nivel.  
2. Configuración de cantidad de subimagen de la Blocka: 4, 6, 8\.  
3. Si el nivel es muy difícil, el usuario puede elegir “Ayudita”: el sistema ubica correctamente una de las subimágenes de la Blocka y la deja fija. En ese caso, el usuario contará con que esa pieza está bien ubicada, aunque se sumarán 5 segundos al contador por la ayuda recibida.  
4. Para incrementar la dificultad, los niveles (al menos los más avanzados) tienen un temporizador de tiempo máximo. Si el usuario no resuelve la blocka en el tiempo definido, pierde el nivel.

Nota: Al menos dos de los cuatro ítems extra son obligatorios para promocionar. Cuanto más se implementen, más posibilidad de mejorar nota.

Condiciones de Entrega:  
●  	Se tendrá en cuenta la completitud del sitio, la funcionalidad demostrada, la justificación de patrones de diseño, etc. junto a la nota conceptual para conformar la nota final.  
●  	Fecha de entrega: Hasta el día 14/10/2026 a las 23:59:59 hs, no se aceptan entregas a partir del deadline.  
●  	La entrega se deberá realizar utilizando el branch **gh-pages** de GitHub.

