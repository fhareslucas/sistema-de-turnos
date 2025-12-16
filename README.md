# Sistema de Turnos

Un sistema moderno y eficiente para la gestión de turnos, colas y atención al cliente, construido con las últimas tecnologías web.

## 🚀 Características

- **Gestión de Turnos**: Creación, administración y seguimiento de turnos en tiempo real.
- **Pantallas de Visualización**:
  - **Pantalla de Espera**: Interfaz optimizada para mostrar a los clientes su posición en la cola.
  - **Pantalla de Atención**: Interfaz clara para el llamado de turnos actuales.
- **Gestión de Mesas**: Administración de mesas y puestos de atención disponibles.
- **Servicios**: Configuración y gestión de los diferentes tipos de servicios ofrecidos.
- **Dashboard Administrativo**: Panel de control centralizado para la gestión operativa.
- **Autenticación**: Sistema de acceso seguro para administradores y operadores.

## 🛠️ Tecnologías

Este proyecto utiliza un stack tecnológico moderno y robusto:

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **UI/Estilos**:
  - [Tailwind CSS](https://tailwindcss.com/) - Framework de utilidades CSS.
  - [Radix UI](https://www.radix-ui.com/) - Primitivas de componentes accesibles.
  - [Lucide React](https://lucide.dev/) - Iconografía consistente.
- **Estado Global**: [Redux Toolkit](https://redux-toolkit.js.org/) - Gestión eficiente del estado de la aplicación.
- **Formularios & Validación**:
  - [React Hook Form](https://react-hook-form.com/) - Manejo de formularios performante.
  - [Zod](https://zod.dev/) - Validación de esquemas TypeScript-first.
- **Cliente HTTP**: [Axios](https://axios-http.com/) - Cliente de promesas para el navegador y node.js.

## 📋 Requisitos Previos

- **Node.js**: Versión 18 o superior (LTS recomendada).
- **Gestor de paquetes**: npm, yarn, pnpm o bun.

## 🔧 Instalación

1. **Clonar el repositorio**

```bash
git clone <url-del-repositorio>
cd sistema-de-turnos
```

2. **Instalar dependencias**

```bash
npm install
# o
yarn install
# o
pnpm install
```

3. **Configurar variables de entorno**

Crea un archivo `.env` en la raíz del proyecto para configurar las variables necesarias, como la URL del backend.

Ejemplo:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## ⚡ Ejecución

Para iniciar el servidor de desarrollo:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

## 📂 Estructura del Proyecto

La estructura principal del proyecto sigue las convenciones de Next.js App Router:

- `/app`: Contiene las rutas y páginas de la aplicación.
  - `/dashboard`: Módulos principales (mesas, turnos, pantallas, servicios).
  - `/auth`: Páginas de autenticación (login).
- `/components`: Componentes de UI reutilizables y modulares.
- `/lib`: Utilidades, configuración de Redux (slices, store), y esquemas de validación.
- `/services`: Capa de servicios para la comunicación con la API externa.
- `/types`: Definiciones de tipos globales y compartidos.
- `/hooks`: Custom hooks de React.

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor, abre un issue para discutir cambios mayores o envía un pull request con tus mejoras.
