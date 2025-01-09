# Plataforma de Inversiones

## Descripción

Una aplicación donde los usuarios puedan explorar proyectos de inversión, invertir en ellos y monitorear sus rendimientos. Los administradores tendrán el control de agregar y gestionar los proyectos disponibles.

---

## Características principales

### Roles de Usuario

#### Administrador:

- Crear, editar y eliminar proyectos de inversión.
- Ver el total de fondos invertidos en cada proyecto.
- Gestionar usuarios (habilitar, deshabilitar cuentas).

#### Inversionista (Usuario):

- Registrarse y crear un perfil.
- Explorar proyectos disponibles para inversión.
- Invertir en un proyecto y ver el historial de inversiones.
- Monitorear ganancias/rendimientos desde un dashboard.

---

## Estructura del Proyecto

### Backend

El proyecto utiliza **Node.js** con **Express** y **Prisma** para manejar la base de datos PostgreSQL. La estructura es la siguiente:

```
src/
├── config/         # Configuraciones de la aplicación
├── controllers/    # Lógica para manejar solicitudes HTTP
├── middlewares/    # Middlewares personalizados
├── models/         # Modelos Prisma (esquema generado)
├── routes/         # Definición de rutas de la API
└── services/       # Servicios para lógica de negocio
```

### Frontend

El proyecto utiliza **Vue.js** con **Vue Router** y **Vuex/Pinia**. La estructura es:

```
src/
├── components/     # Componentes reutilizables
├── views/          # Vistas principales de la aplicación
├── store/          # Manejo del estado global
├── router/         # Configuración de rutas
└── assets/         # Recursos estáticos como imágenes y estilos
```

---

## Funcionalidades principales

### Roles de Usuario

1. **Administrador**:

   - Crear, editar y eliminar proyectos de inversión.
   - Ver el total de fondos invertidos en cada proyecto.
   - Gestionar usuarios (habilitar, deshabilitar cuentas).

2. **Inversionista (Usuario)**:
   - Registrarse y crear un perfil.
   - Explorar proyectos disponibles para inversión.
   - Invertir en un proyecto y ver el historial de inversiones.
   - Monitorear ganancias/rendimientos desde un dashboard.

## Base de Datos

El proyecto utiliza **Prisma** para manejar la base de datos PostgreSQL. Las tablas definidas son:

### User

| Campo    | Tipo    | Descripción                      |
| -------- | ------- | -------------------------------- |
| id       | String  | Identificador único del usuario  |
| email    | String  | Correo electrónico               |
| password | String  | Contraseña encriptada            |
| roleId   | Integer | Rol del usuario                  |
| balance  | Decimal | Balance disponible para invertir |

### Role

| Campo | Tipo    | Descripción                      |
| ----- | ------- | -------------------------------- |
| id    | Integer | Identificador único del rol      |
| name  | String  | Nombre del rol (Admin o Usuario) |

### Category

| Campo | Tipo    | Descripción                         |
| ----- | ------- | ----------------------------------- |
| id    | Integer | Identificador único de la categoría |
| name  | String  | Nombre de la categoría              |

### Project

| Campo         | Tipo     | Descripción                                        |
| ------------- | -------- | -------------------------------------------------- |
| id            | String   | Identificador único del proyecto                   |
| title         | String   | Título del proyecto                                |
| description   | String   | Descripción del proyecto                           |
| categoryId    | Integer  | Categoría del proyecto                             |
| targetAmount  | Decimal  | Monto objetivo                                     |
| currentAmount | Decimal  | Monto actual alcanzado                             |
| createdAt     | DateTime | Fecha de creación del proyecto                     |
| status        | Enum     | Estado del proyecto (abierto, cerrado, financiado) |

### Investment

| Campo     | Tipo     | Descripción                         |
| --------- | -------- | ----------------------------------- |
| id        | String   | Identificador único de la inversión |
| userId    | String   | ID del usuario que invierte         |
| projectId | String   | ID del proyecto invertido           |
| amount    | Decimal  | Monto invertido                     |
| createdAt | DateTime | Fecha de inversión                  |

---

## Configuración Inicial

### Requisitos

- **Node.js** (versión LTS recomendada)
- **PostgreSQL** (instancia local o en la nube)
- **Prisma CLI** (instalado globalmente o como dependencia del proyecto)

### Pasos

1. Clonar el repositorio:

   ```bash
   git clone <url-del-repositorio>
   cd <nombre-del-repositorio>
   ```

2. Instalar dependencias:

   ```bash
   npm install
   ```

3. Configurar variables de entorno:
   Crear un archivo `.env` en la raíz con las siguientes variables:

   ```env
   DATABASE_URL="postgresql://<usuario>:<contraseña>@<host>:<puerto>/<nombre_db>?schema=public"
   JWT_SECRET="tu_clave_secreta"
   ```

4. Ejecutar migraciones para crear la base de datos:

   ```bash
   npx prisma migrate dev --name init
   ```

5. Ejecutar en la carpeta prisma archivo seed que agregara información a la base de datos.

```bash
   node seed.js
```

5. Iniciar el servidor:
   ```bash
   npm run dev
   ```

---
