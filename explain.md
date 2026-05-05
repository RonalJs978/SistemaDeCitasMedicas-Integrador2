# Explicación del `navItems` en SidebarAdmin

## ¿Qué es `navItems`?

`navItems` es un **array de objetos** que define los elementos del menú de navegación en la barra lateral (sidebar) de administración.

```tsx
const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboardIcon, path: '/admin/dashboard' },
  { id: 'register', label: 'Registro Docs', icon: NotebookIcon, path: '/admin/reports' },
  { id: 'doctors', label: 'Directorio Docs', icon: List, path: '/admin/users' },
];
```

## Propiedades de cada item

| Propiedad | Tipo | Descripción |
|---|---|---|
| `id` | `string` | Identificador único del item (para saber cuál está activo) |
| `label` | `string` | Texto que se muestra en el menú |
| `icon` | `Component` | Icono de Lucide React que se muestra al lado del texto |
| `path` | `string` | **Ruta URL** para la navegación (NO es una ruta de archivo) |

## ¿Qué es el `path`?

El `path` **NO es la ubicación de un archivo**. Es una **ruta de URL** que utiliza **React Router** para navegar entre páginas de la aplicación.

### Ejemplo de funcionamiento:

```
path: '/admin/dashboard'  →  El navegador va a: http://localhost:5173/admin/dashboard
path: '/admin/reports'    →  El navegador va a: http://localhost:5173/admin/reports
path: '/admin/users'      →  El navegador va a: http://localhost:5173/admin/users
```

Estas rutas están definidas en el **enrutador de la aplicación** (probablemente en `App.tsx` o un archivo de rutas), no son archivos del sistema.

## ¿Cómo funciona al hacer clic?

```tsx
onClick={() => {
  setActiveItem(item.id);    // 1. Marca el item como activo (resalta el botón)
  navigate(item.path);        // 2. Navega a la URL definida en `path`
}}
```

1. **`setActiveItem(item.id)`** → Cambia el estado para resaltar el botón seleccionado con estilos visuales (fondo azul, borde izquierdo).
2. **`navigate(item.path)`** → Usa React Router para cambiar la página sin recargar el navegador.

## Relación con las rutas de la app

Para que la navegación funcione, debe existir una configuración de rutas que coincida con estos paths, por ejemplo:

```tsx
<Route path="/admin/dashboard" element={<AdminDashboard />} />
<Route path="/admin/reports" element={<AdminReports />} />
<Route path="/admin/users" element={<AdminUsers />} />
```
