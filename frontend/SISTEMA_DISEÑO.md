# 🎨 Sistema de Diseño RESEJ - Policial-Judicial Profesional

## Descripción General

Este sistema de diseño implementa una interfaz profesional para aplicaciones policiales-judiciales, con énfasis en la legibilidad, accesibilidad y profesionalismo institucional.

## 🎯 Características Principales

### Paleta de Colores Institucional

#### Colores Primarios

- **Azul Judicial Oscuro** (`#1e3a8a`) - Color institucional principal
- **Azul Institucional** (`#3b82f6`) - Acentos y elementos interactivos
- **Gris Acero** (`#475569`) - Elementos secundarios
- **Azul Información** (`#0ea5e9`) - Estados informativos

#### Estados y Alertas

- **Verde Éxito** (`#10b981`) - Operaciones exitosas
- **Amarillo Alerta** (`#f59e0b`) - Advertencias
- **Rojo Crítico** (`#ef4444`) - Errores y acciones peligrosas
- **Dorado Institucional** (`#f59e0b`) - Badges administrativos

### Tipografía Profesional

- **Fuente Principal**: Inter (Google Fonts)
- **Escala de Tamaños**: 12px - 36px
- **Pesos**: 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold), 800 (ExtraBold)

### Efectos Visuales Modernos

#### Glass Morphism

```css
background: rgba(51, 65, 85, 0.5);
backdrop-filter: blur(12px);
border: 1px solid rgba(203, 213, 225, 0.1);
```

#### Sombras Profesionales

- **sm**: Sombra sutil para elementos elevados
- **md**: Sombra media para cards
- **lg**: Sombra grande para modales
- **xl**: Sombra extra grande para overlays
- **glow**: Efecto de brillo para elementos activos

### Componentes Reutilizables

#### Badges

- Primario, Éxito, Advertencia, Peligro, Info
- Bordes redondeados con efecto glow

#### Alertas

- Estados: success, warning, danger, info
- Animación de entrada suave
- Bordes laterales de color

#### Botones

- Primario, Secundario, Peligro
- Estados: hover, active, disabled
- Efectos de elevación en hover

#### Cards

- Glass morphism background
- Borde superior de color
- Hover effects con elevación
- Variantes: primary, success, warning, danger

#### Tablas

- Header sticky
- Hover effects en filas
- Paginación integrada
- Responsive design

#### Modales

- Overlay con blur
- Animación de entrada
- Header, body y footer estructurados

## 📁 Estructura de Archivos

```
frontend/src/
├── index.css              # Sistema de diseño base (variables CSS)
├── App.css                # Layouts y componentes generales
├── styles/
│   └── shared-styles.css  # Componentes compartidos
├── components/
│   ├── auth/
│   │   ├── Login.jsx
│   │   └── Login.css
│   ├── dashboard/
│   │   ├── Dashboard.jsx
│   │   └── Dashboard.css
│   ├── layout/
│   │   ├── AppNavbar.jsx
│   │   ├── AppNavbar.css
│   │   ├── Footer.jsx
│   │   └── Footer.css
│   ├── registros/
│   │   ├── Registros.jsx
│   │   └── Registros.css
│   └── usuarios/
│       ├── UsersManagement.jsx
│       └── UsersManagement.css
```

## 🚀 Uso del Sistema de Diseño

### Variables CSS

Todas las variables están definidas en `index.css`:

```css
/* Colores */
var(--color-primary)
var(--color-success)
var(--color-warning)
var(--color-danger)

/* Espaciado */
var(--spacing-xs)   /* 4px */
var(--spacing-sm)   /* 8px */
var(--spacing-md)   /* 16px */
var(--spacing-lg)   /* 24px */
var(--spacing-xl)   /* 32px */

/* Tipografía */
var(--font-size-xs)    /* 12px */
var(--font-size-sm)    /* 14px */
var(--font-size-base)  /* 16px */
var(--font-size-lg)    /* 18px */

/* Border Radius */
var(--radius-sm)
var(--radius-md)
var(--radius-lg)
var(--radius-xl)

/* Transiciones */
var(--transition-fast)
var(--transition-base)
var(--transition-slow)
```

### Componentes Compartidos

Los componentes están disponibles en `shared-styles.css`:

```html
<!-- Stat Card -->
<div class="stat-card">
  <div class="stat-icon primary">📊</div>
  <div class="stat-content">
    <div class="stat-label">Total</div>
    <div class="stat-value">1,234</div>
  </div>
</div>

<!-- Badge -->
<span class="badge badge-primary">Estado</span>

<!-- Alert -->
<div class="alert alert-success">
  Operación exitosa
</div>

<!-- Progress Bar -->
<div class="progress">
  <div class="progress-bar" style="width: 75%"></div>
</div>
```

## 🎨 Guía de Estilo

### Iconografía

- Uso de emojis para iconos institucionales: ⚖️ 📊 👤 🔐 📁
- Tamaño recomendado: 1.25rem - 2.5rem

### Espaciado

- Usar múltiplos de 4px (siguiendo las variables --spacing-\*)
- Padding cards: var(--spacing-xl)
- Gap en grids: var(--spacing-lg)

### Animaciones

- Transiciones suaves: var(--transition-base)
- Hover effects: translateY(-2px a -4px)
- Fade in para nuevos elementos

### Responsive Design

- Breakpoints:
  - Mobile: max-width: 768px
  - Tablet: max-width: 1024px
  - Desktop: min-width: 1025px

## 📱 Accesibilidad

- Contraste de color WCAG AA compliant
- Focus visible en elementos interactivos
- Tamaños mínimos de touch targets: 44x44px
- Textos legibles mínimo 14px

## 🔧 Personalización

Para personalizar el tema, edita las variables en `index.css`:

```css
:root {
  --color-primary: #tu-color;
  --font-family-base: 'TuFuente', sans-serif;
}
```

## 📚 Recursos Adicionales

- [Fuente Inter](https://fonts.google.com/specimen/Inter)
- [Guía de Color](https://tailwindcss.com/docs/customizing-colors)
- [Sistema de Espaciado](https://tailwindcss.com/docs/customizing-spacing)

---

**Desarrollado por**: SanzTech & LJD  
**Versión**: 1.0.0  
**Última actualización**: Noviembre 2025
