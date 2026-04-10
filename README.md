# Frontend - Jardín Monserrat

Sistema de Gestión Escolar - Frontend en React con Bootstrap

## Requisitos Previos

- Node.js (v14 o superior)
- npm o yarn

## Instalación

```bash
# Instalar dependencias
npm install

# O con yarn
yarn install
```

## Configuración

El archivo `.env` contiene la configuración de conexión con el backend:

```env
REACT_APP_API_URL=http://127.0.0.1:8000/api
```

Asegúrate de que el backend Django esté corriendo en `http://127.0.0.1:8000` antes de iniciar el frontend.

## Iniciar Desarrollo

```bash
npm start
```

La aplicación se abrirá en `http://localhost:3000`

## Estructura del Proyecto

```
src/
├── api/                      # Configuración de Axios
│   └── axiosConfig.js       # Cliente HTTP con interceptores
├── components/               # Componentes reutilizables
│   └── ProtectedRoute.jsx   # Rutas protegidas
├── context/                  # Contexto global de la app
│   └── AuthContext.jsx      # Manejo de autenticación
├── pages/                    # Páginas principales
│   ├── LoginPage.jsx        # Página de inicio de sesión
│   ├── LoginPage.css
│   ├── DashboardPage.jsx    # Panel de control
│   └── DashboardPage.css
├── App.jsx                   # Componente principal
├── App.css
└── index.jsx                 # Punto de entrada
```

## Características

- ✅ Autenticación JWT con Django
- ✅ Interceptores automáticos de tokens
- ✅ Rutas protegidas
- ✅ Notificaciones con React Hot Toast
- ✅ Diseño responsivo con Bootstrap 5
- ✅ Logout automático en token expirado

## Credenciales de Prueba

```
Usuario: admin
Contraseña: [la que creaste en Django]
```

## Flow de Autenticación

1. Usuario ingresa credenciales en `/login`
2. Se envían a `POST /api/token/`
3. Se reciben tokens `access` y `refresh`
4. Se guardan en localStorage
5. Cada solicitud agrega el header `Authorization: Bearer <token>`
6. Si el token expira, se intenta refrescar automáticamente
7. Si falla, se redirige a login

## Variables de Entorno

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `REACT_APP_API_URL` | URL del API Backend | `http://127.0.0.1:8000/api` |

## Build para Producción

```bash
npm run build
```

Genera una carpeta `build/` lista para desplegar.

## Troubleshooting

### Error: "Cannot reach backend"
- Verifica que Django esté corriendo en `http://127.0.0.1:8000`
- Revisa la configuración de CORS en `settings.py` del backend

### Error: "Invalid credentials"
- Verifica que el usuario existe en Django admin
- Asegúrate de haber ejecutado `python manage.py createsuperuser`

### CORS Error
- El backend debe tener `CORS_ALLOWED_ORIGINS` configurado con `http://localhost:3000`

## Licencia

© 2026 Jardín Monserrat. Todos los derechos reservados.
