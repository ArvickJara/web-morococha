# Proyecto Morococha

Este proyecto incluye un backend basado en Strapi (CMS) y un frontend llamado **fe-morococha** para la gestión de concesiones y solicitudes de permiso.

## 📦 Estructura del proyecto

- `cms-morococha/` — Backend (Strapi CMS)
- `fe-morococha/` — Frontend

---

## 🚀 Pasos para ejecutar el proyecto

### 1. Clonar el repositorio

```bash
git clone https://github.com/ArvickJara/web-morococha
cd web-morococha
```

---

### 2. Backend: CMS Strapi

#### a) Instalar dependencias

```bash
cd cms-morococha
npm install
```

#### b) Instalar dependencias nativas necesarias (si es requerido)

Si usas SQLite y ves errores, ejecuta:

```bash
npm install better-sqlite3 --save
```

#### c) Crear carpeta de uploads (si no existe)

```bash
mkdir public\uploads
```

#### e) Crear y configurar .env

```bash
Clonar .env.example y renombrar a .env realizaondo su configuración
```

#### e) Ejecutar el servidor de desarrollo

```bash
npm run develop
```

El panel de administración estará disponible en [http://localhost:1337/admin].

---

### 3. Frontend: fe-morococha

#### a) Instalar dependencias

```bash
cd ../fe-morococha
npm install
```

#### b) Ejecutar el frontend

```bash
npm run dev
```

El frontend estará disponible en [http://localhost:3000] (o el puerto configurado).

---

## ⚠️ Notas

- Asegúrate de tener Node.js y npm instalados.
- Configura las variables de entorno necesarias en los archivos `.env` de cada proyecto.
- Si tienes problemas con dependencias nativas, revisa la documentación oficial de Strapi y de tu sistema operativo.

---

## 📚 Recursos útiles

- [Documentación Strapi](https://docs.strapi.io/)
- [Documentación React](https://react.dev/)
- [Documentación Vite](https://vitejs.dev/)
- [Documentación TypeScript](https://www.typescriptlang.org/docs/)
