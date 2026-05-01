# SNAKE — AE6-1

**URL del proyecto:** SnakeTRM.github.io

Juego clásico de Snake con menú de personalización completo, desarrollado en HTML5 Canvas, CSS3 y JavaScript vanilla.


## Estructura del proyecto

```
AE6-1/
├── index.html          → Punto de entrada principal
├── README.md           → Este archivo
├── css/
├── html/               → (Páginas adicionales futuras)
├── images/             → (Imágenes y assets)
├── js/
│   └── game.js         → Lógica del juego completa
├── sounds/             → Carpeta para archivos de audio (.mp3/.ogg)
└── pdf/
    └── controles.pdf   → Manual de controles (añadir manualmente)
```

---

## 🎮 Características

### Pantalla de nombre
- Al entrar, el jugador introduce su nombre (máx. 12 caracteres)
- El nombre se muestra con el color de serpiente elegido

### Menú principal
- **Nueva Partida** — Inicia el juego con la configuración actual
- **Configuración** — Abre el menú de ajustes
- **Ayuda / Controles** — Información de controles y PDF
- **Cambiar Nombre** — Volver a la pantalla de nombre

### Menú de configuración (4 pestañas)
| Pestaña | Contenido |
|---------|-----------|
| 🎨 Visual | Fondo del escenario, color de serpiente, tipo de fruta |
| 🐍 Serpiente | Cantidad de frutas en pantalla (1-10) |
| 🔊 Audio | Volumen de efectos y música |
| ⚡ Modo | Velocidad / modo de juego |

### Fondos disponibles
-  Galaxia |  Nevada |  Césped |  Desierto
-  Océano |  Lava |  Bosque |  Neón

### Colores de serpiente (12 opciones)
Verde neón, Cian, Azul, Lila, Rosa, Rojo, Naranja, Amarillo, Blanco, Oro, Menta, Coral

### Tipos de fruta (9 opciones)
🍎 🍊 🍇 🍓 🍍 🍒 💎 ⭐ 🌕

### Modos de juego
| Modo | FPS | Descripción |
|------|-----|-------------|
| 🐢 Lento | 6 | Perfecto para aprender |
| 🐍 Normal | 10 | Experiencia estándar |
| ⚡ Rápido | 15 | Para expertos |
| 💀 Extremo | 22 | Sin piedad |
| ∞ Infinito | 10 | Atraviesas los muros |

## ⌨️ Controles

| Tecla | Acción |
|-------|--------|
| ↑ W | Mover arriba |
| ↓ S | Mover abajo |
| ← A | Mover izquierda |
| → D | Mover derecha |
| P / ESC | Pausar / Reanudar |