# 🏪 Sistema de Gestión de Productos

## ⚡ Instalación Rápida

Copiar y pegar estos comandos en tu terminal para dejar todo listo:

```bash
# 1) Backend: instalar deps y crear .env
cd 'carpeta en donde esta el repo'
npm install


# (Opcional) Crear tabla y datos de ejemplo en SQL Server
# Abre SSMS y ejecuta el script:
# Archivo: /setup-database.sql

# 2) Iniciar backend
npm run dev
```

En otra terminal:

```bash
# 3) Frontend: instalar deps e iniciar
cd 'carpeta del front'
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



Un tuto facil para usar los repos

  Para traer a tu PC los cambios que otros usuarios han subido al repositorio, el comando principal es:

   1 git pull

  El Flujo de Trabajo Correcto

  Simplemente ejecutar git pull funciona, pero para evitar problemas, te recomiendo seguir siempre este pequeño proceso:

  Paso 1: Asegúrate de que tu trabajo local está guardado

  Antes de traer los cambios de otros, asegúrate de que tus propios cambios (si tienes alguno) están confirmados. Ejecuta:

   1 git status

   * Si dice nothing to commit, working tree clean, estás listo para el siguiente paso.
   * Si tienes archivos modificados, debes guardarlos con un commit:

   1     git add .
   2     git commit -m "Un mensaje que describe mis cambios"

  Paso 2: Trae los cambios del repositorio remoto

  Ahora sí, ejecuta el comando para descargar y fusionar los cambios. Como tu rama principal es master, el comando completo sería:

   1 git pull origin master

  (Aunque git pull solo probablemente funcionará, ser explícito es una buena práctica).

  La terminal te mostrará qué archivos se actualizaron, eliminaron o añadieron.

  Paso 3: Sube tus propios cambios (si los tenías)

  Si hiciste un commit en el paso 1, ahora es el momento de subir tus cambios para que los demás los vean:

   1 git push origin master

  En resumen, tu ciclo de trabajo diario será:

   1. ¿Voy a empezar a trabajar? Primero actualizo mi local con git pull origin master.
   2. ¿Terminé una tarea? La guardo con git add . y git commit -m "mensaje".
   3. ¿Quiero compartir mi tarea terminada? La subo con git push origin master.

  ¿Qué pasa si hay un conflicto?

  A veces, tú y otra persona pueden modificar la misma línea en el mismo archivo. Cuando hagas git pull, Git no sabrá qué cambio conservar y 
  te avisará de un "merge conflict" (conflicto de fusión).

  Si esto pasa:
   1. Git te dirá qué archivos tienen conflictos.
   2. Abre esos archivos en tu editor de código. Verás unas marcas especiales (<<<<<<<, =======, >>>>>>>) que te muestran tanto tus cambios 
      como los de la otra persona.
   3. Edita el archivo para dejarlo como debería ser (borrando las marcas y quedándote con el código correcto).
   4. Guarda el archivo.
   5. Ejecuta git add . y git commit para finalizar la fusión.

  No te preocupes si te pasa, es una parte normal del trabajo en equipo.
