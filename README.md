# 🏪 Sistema de Gestión de Productos

## ⚡ Instalación Rápida

Copiar y pegar estos comandos en tu terminal para dejar todo listo:

```bash
# 1) Backend: instalar deps y crear .env
cd '/home/lean/TPI desarrollo/REPOTPI/mi-app-backend'
npm install
printf "PORT=3000\nDB_USER=sa\nDB_PASSWORD=tu_contraseña_secreta\nDB_SERVER=localhost\nDB_DATABASE=nombre_de_tu_bd\n" > .env

# (Opcional) Crear tabla y datos de ejemplo en SQL Server
# Abre SSMS y ejecuta el script:
# Archivo: /home/lean/TPI desarrollo/REPOTPI/setup-database.sql

# 2) Iniciar backend
npm run dev
```

En otra terminal:

```bash
# 3) Frontend: instalar deps e iniciar
cd '/home/lean/TPI desarrollo/REPOTPI/mi-app-frontend'
npm install
npm run dev
```

URLs por defecto:
- Backend: `http://localhost:3000`
- Frontend: `http://localhost:5173`

Sistema full-stack para gestión de productos desarrollado con React, Node.js y SQL Server.

## 🚀 Tecnologías Utilizadas

### Frontend
- **React** con TypeScript
- **Vite** para desarrollo rápido
- **CSS3** con diseño moderno y responsive

### Backend
- **Node.js** con Express
- **Microsoft SQL Server** (MSSQL)
- **CORS** para comunicación entre frontend y backend

## 📁 Estructura del Proyecto

```
REPOTPI/
├── mi-app-frontend/          # Aplicación React
│   ├── src/
│   │   ├── components/       # Componentes React
│   │   ├── services/         # Servicios API
│   │   ├── App.tsx          # Componente principal
│   │   └── main.ts          # Punto de entrada
│   └── package.json
├── mi-app-backend/           # Servidor Node.js
│   ├── index.js             # Servidor principal
│   ├── dbConfig.js          # Configuración de base de datos
│   ├── .env                 # Variables de entorno
│   └── package.json
└── README.md
```

## 🛠️ Instalación y Configuración

### Prerrequisitos
- Node.js (v16 o superior)
- Microsoft SQL Server
- npm o yarn

### 1. Configurar Backend

```bash
cd mi-app-backend
npm install
```

Crear archivo `.env` con las credenciales de tu base de datos:

```env
PORT=3000
DB_USER=sa
DB_PASSWORD=tu_contraseña_secreta
DB_SERVER=localhost
DB_DATABASE=nombre_de_tu_bd
```

### 2. Configurar Base de Datos

Ejecutar el siguiente script SQL para crear la tabla de productos:

```sql
CREATE TABLE Productos (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(100) NOT NULL,
    descripcion NVARCHAR(500),
    precio DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0,
    fecha_creacion DATETIME DEFAULT GETDATE()
);
```

### 3. Configurar Frontend

```bash
cd mi-app-frontend
npm install
```

## 🚀 Ejecutar la Aplicación

### Backend
```bash
cd mi-app-backend
npm run dev
```
El servidor estará disponible en: http://localhost:3000

### Frontend
```bash
cd mi-app-frontend
npm run dev
```
La aplicación estará disponible en: http://localhost:5173

## 📡 Endpoints de la API

### Productos
- `GET /api/productos` - Obtener todos los productos
- `GET /api/productos/:id` - Obtener un producto por ID
- `POST /api/productos` - Crear un nuevo producto
- `PUT /api/productos/:id` - Actualizar un producto
- `DELETE /api/productos/:id` - Eliminar un producto

### Ejemplo de uso:

```javascript
// Crear producto
const nuevoProducto = {
  nombre: "Laptop",
  descripcion: "Laptop para desarrollo",
  precio: 1200.00,
  stock: 10
};

fetch('http://localhost:3000/api/productos', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(nuevoProducto)
});
```

## 🎨 Características de la Aplicación

- ✅ **CRUD completo** de productos
- ✅ **Interfaz moderna** y responsive
- ✅ **Validación de formularios**
- ✅ **Manejo de errores**
- ✅ **Estados de carga**
- ✅ **Confirmación de eliminación**
- ✅ **Diseño con gradientes y efectos**

## 🔧 Desarrollo

### Estructura de Componentes

- `App.tsx` - Componente principal con estado global
- `ProductoList.tsx` - Lista de productos con acciones
- `ProductoForm.tsx` - Formulario para crear/editar productos
- `api.ts` - Servicio para comunicación con el backend

### Estilos

Los estilos están organizados en `App.css` con:
- Diseño responsive
- Efectos de hover y transiciones
- Gradientes y backdrop-filter
- Estados de error y carga

## 🐛 Solución de Problemas

### Error de conexión a la base de datos
1. Verificar que SQL Server esté ejecutándose
2. Confirmar credenciales en `.env`
3. Verificar que la base de datos existe

### Error CORS
- El backend ya incluye configuración CORS
- Verificar que el frontend apunte a `http://localhost:3000`

### Puerto ocupado
- Cambiar el puerto en `.env` (backend) o `vite.config.ts` (frontend)

## 📝 Notas Adicionales

- El archivo `.env` no debe subirse al repositorio
- La aplicación está configurada para desarrollo local
- Para producción, configurar variables de entorno apropiadas
- Considerar implementar autenticación para uso en producción

## 🤝 Contribuir

1. Fork el proyecto
2. Crear una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
