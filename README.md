Web municipal de Morococha

Ejecutar backend:

- npm install

- npm run migrate-seed

- node server.js

Ejecutar Frontend:

- cd fe-morococha

- npm install

- npm run dev

---

# Documentación de la API

## Tabla de contenidos
- [Autenticación](#autenticación)
- [Usuarios](#usuarios)
- [Municipalidad](#municipalidad)
- [Noticias](#noticias)
- [Redes Sociales](#redes-sociales)
- [Servicios](#servicios)
- [Miembros](#miembros)
- [Proyectos](#proyectos)
- [Tipos de Convocatorias](#tipos-de-convocatorias)
- [Convocatorias](#convocatorias)

## Autenticación

La API utiliza autenticación por token JWT. Para rutas protegidas, incluye el token en el header:

```
Authorization: Bearer <token>
```

El token se obtiene mediante el endpoint de login.

## Usuarios

Gestión de usuarios administrativos del sistema.

### Endpoints

| Método | Ruta | Descripción | Protección |
|--------|------|-------------|------------|
| POST | `/api/usuarios/login` | Iniciar sesión | Pública |
| GET | `/api/usuarios` | Listar todos los usuarios | Admin |
| GET | `/api/usuarios/:id` | Obtener un usuario por ID | Admin |
| POST | `/api/usuarios` | Crear un nuevo usuario | Admin |
| PUT | `/api/usuarios/:id` | Actualizar un usuario | Admin |
| DELETE | `/api/usuarios/:id` | Eliminar un usuario | Admin |

### Ejemplos

#### Login
```
POST /api/usuarios/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

Respuesta:
```json
{
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "admin"
}
```

#### Crear usuario
```
POST /api/usuarios
Content-Type: application/json
Authorization: Bearer <token>

{
  "role": "admin",
  "nombres": "Juan",
  "primer_apellido": "Pérez",
  "segundo_apellido": "García",
  "dni": "12345678",
  "email": "juanperez@example.com",
  "telefono": "987654321",
  "password": "password123"
}
```

## Municipalidad

Información general de la municipalidad.

### Endpoints

| Método | Ruta | Descripción | Protección |
|--------|------|-------------|------------|
| GET | `/api/municipalidad` | Obtener información completa | Pública |
| PUT | `/api/municipalidad/:id` | Actualizar información | Admin |

### Ejemplos

#### Obtener información
```
GET /api/municipalidad
```

Respuesta:
```json
{
  "id": 1,
  "nombre": "Municipalidad de Morococha",
  "slogan": "Trabajando juntos por un futuro mejor",
  "direccion": "Av. Principal 123",
  "telefono": "987654321",
  "email": "contacto@morococha.gob.pe",
  "horarios_atencion": "Lunes a Viernes 8:00 - 16:00",
  "redes_sociales": [...],
  "servicios": [...]
}
```

## Noticias

Gestión de noticias y comunicados.

### Endpoints

| Método | Ruta | Descripción | Protección |
|--------|------|-------------|------------|
| GET | `/api/noticias` | Listar noticias | Pública |
| GET | `/api/noticias/:id` | Obtener noticia por ID | Pública |
| POST | `/api/noticias` | Crear noticia | Admin |
| PUT | `/api/noticias/:id` | Actualizar noticia | Admin |
| DELETE | `/api/noticias/:id` | Eliminar noticia | Admin |

### Parámetros de consulta (GET /noticias)

- `page`: Número de página (default: 1)
- `limit`: Cantidad por página (default: 10)
- `destacada`: Filtrar por noticias destacadas (true/false)
- `activa`: Filtrar por noticias activas (default: true)

### Ejemplos

#### Listar noticias destacadas
```
GET /api/noticias?destacada=true
```

#### Crear noticia (JSON)
```
POST /api/noticias
Content-Type: application/json
Authorization: Bearer <token>

{
  "titulo": "Nueva obra municipal",
  "resumen": "Resumen breve de la noticia",
  "contenido": "Contenido completo de la noticia...",
  "autor": "Oficina de Comunicaciones",
  "destacada": true
}
```

#### Crear noticia con imagen (Multipart)
```
POST /api/noticias
Content-Type: multipart/form-data
Authorization: Bearer <token>

- titulo: "Nueva obra municipal"
- resumen: "Resumen breve de la noticia"
- contenido: "Contenido completo de la noticia..."
- autor: "Oficina de Comunicaciones"
- destacada: true
- imagen: [archivo]
```

## Redes Sociales

Gestión de redes sociales de la municipalidad.

### Endpoints

| Método | Ruta | Descripción | Protección |
|--------|------|-------------|------------|
| GET | `/api/redes-sociales` | Listar redes sociales | Pública |
| GET | `/api/redes-sociales/:id` | Obtener red social por ID | Pública |
| POST | `/api/redes-sociales` | Crear red social | Admin |
| PUT | `/api/redes-sociales/:id` | Actualizar red social | Admin |
| DELETE | `/api/redes-sociales/:id` | Eliminar red social | Admin |

### Ejemplos

#### Crear red social
```
POST /api/redes-sociales
Content-Type: application/json
Authorization: Bearer <token>

{
  "municipalidad_id": 1,
  "plataforma": "Facebook",
  "url": "https://facebook.com/municipalidadmorococha",
  "activo": true
}
```

## Servicios

Gestión de servicios municipales.

### Endpoints

| Método | Ruta | Descripción | Protección |
|--------|------|-------------|------------|
| GET | `/api/servicios` | Listar servicios | Pública |
| GET | `/api/servicios/:id` | Obtener servicio por ID | Pública |
| POST | `/api/servicios` | Crear servicio | Admin |
| PUT | `/api/servicios/:id` | Actualizar servicio | Admin |
| DELETE | `/api/servicios/:id` | Eliminar servicio | Admin |

### Ejemplos

#### Crear servicio
```
POST /api/servicios
Content-Type: application/json
Authorization: Bearer <token>

{
  "municipalidad_id": 1,
  "nombre": "Registro Civil",
  "descripcion": "Trámites de partidas de nacimiento, matrimonio y defunción",
  "icono": "fa-id-card",
  "orden": 1,
  "activo": true
}
```

## Miembros

Gestión de autoridades y funcionarios municipales.

### Endpoints

| Método | Ruta | Descripción | Protección |
|--------|------|-------------|------------|
| GET | `/api/miembros` | Listar miembros | Pública |
| GET | `/api/miembros/:id` | Obtener miembro por ID | Pública |
| POST | `/api/miembros` | Crear miembro | Admin |
| PUT | `/api/miembros/:id` | Actualizar miembro | Admin |
| DELETE | `/api/miembros/:id` | Eliminar miembro | Admin |

### Parámetros de consulta (GET /miembros)

- `activo`: Filtrar por miembros activos (default: true)

### Ejemplos

#### Crear miembro con imagen
```
POST /api/miembros
Content-Type: multipart/form-data
Authorization: Bearer <token>

- cargo: "Alcalde"
- nombres: "Juan"
- apellidos: "Pérez García"
- orden: 1
- activo: true
- imagen: [archivo]
```

## Proyectos

Gestión de proyectos y proyectos municipales.

### Endpoints

| Método | Ruta | Descripción | Protección |
|--------|------|-------------|------------|
| GET | `/api/proyectos` | Listar proyectos | Pública |
| GET | `/api/proyectos/:id` | Obtener obra por ID | Pública |
| POST | `/api/proyectos` | Crear obra | Admin |
| PUT | `/api/proyectos/:id` | Actualizar obra | Admin |
| DELETE | `/api/proyectos/:id` | Eliminar obra | Admin |

### Parámetros de consulta (GET /proyectos)

- `page`: Número de página (default: 1)
- `limit`: Cantidad por página (default: 10)
- `estado`: Filtrar por estado ('planificacion', 'ejecucion', 'finalizada')
- `activa`: Filtrar por proyectos activas (default: true)

### Ejemplos

#### Listar proyectos en ejecución
```
GET /api/proyectos?estado=ejecucion
```

#### Crear obra con imagen
```
POST /api/proyectos
Content-Type: multipart/form-data
Authorization: Bearer <token>

- titulo: "Construcción de puente peatonal"
- descripcion: "Construcción de puente peatonal en el sector sur"
- ubicacion: "Sector Sur, Morococha"
- fecha_inicio: "2023-04-01"
- fecha_fin: "2023-12-31"
- presupuesto: 500000.00
- estado: "ejecucion"
- activa: true
- imagen: [archivo]
```

## Tipos de Convocatorias

Gestión de categorías para las convocatorias municipales.

### Endpoints

| Método | Ruta | Descripción | Protección |
|--------|------|-------------|------------|
| GET | `/api/convocatoria-tipos` | Listar tipos de convocatorias | Pública |
| GET | `/api/convocatoria-tipos/:id` | Obtener tipo por ID | Pública |
| POST | `/api/convocatoria-tipos` | Crear tipo de convocatoria | Admin |
| PUT | `/api/convocatoria-tipos/:id` | Actualizar tipo de convocatoria | Admin |
| DELETE | `/api/convocatoria-tipos/:id` | Eliminar tipo de convocatoria | Admin |

### Parámetros de consulta (GET /convocatoria-tipos)

- `activo`: Filtrar por tipos activos (default: true)

### Ejemplos

#### Listar todos los tipos de convocatorias
```
GET /api/convocatoria-tipos
```

#### Crear tipo de convocatoria
```
POST /api/convocatoria-tipos
Content-Type: application/json
Authorization: Bearer <token>

{
  "nombre": "CAS",
  "descripcion": "Contratación Administrativa de Servicios",
  "activo": true
}
```

## Convocatorias

Gestión de convocatorias municipales con sus archivos asociados.

### Endpoints

| Método | Ruta | Descripción | Protección |
|--------|------|-------------|------------|
| GET | `/api/convocatorias` | Listar convocatorias | Pública |
| GET | `/api/convocatorias/:id` | Obtener convocatoria por ID | Pública |
| POST | `/api/convocatorias` | Crear convocatoria | Admin |
| PUT | `/api/convocatorias/:id` | Actualizar convocatoria | Admin |
| DELETE | `/api/convocatorias/:id` | Eliminar convocatoria | Admin |
| POST | `/api/convocatorias/:id/archivos` | Subir archivos para una convocatoria | Admin |
| DELETE | `/api/convocatorias/:convocatoriaId/archivos/:archivoId` | Eliminar archivo de convocatoria | Admin |

### Parámetros de consulta (GET /convocatorias)

- `page`: Número de página (default: 1)
- `limit`: Cantidad por página (default: 10)
- `tipo_id`: Filtrar por tipo de convocatoria
- `estado`: Filtrar por estado ('borrador', 'publicada', 'en_proceso', 'finalizada')
- `activa`: Filtrar por convocatorias activas (default: true)

### Ejemplos

#### Listar convocatorias de un tipo específico
```
GET /api/convocatorias?tipo_id=1&estado=publicada
```

#### Crear una convocatoria
```
POST /api/convocatorias
Content-Type: application/json
Authorization: Bearer <token>

{
  "tipo_id": 1,
  "nombre_proceso": "Convocatoria CAS N° 001-2023",
  "descripcion": "Proceso de selección para el puesto de Asistente Administrativo",
  "fecha_inicio": "2023-05-01",
  "fecha_fin": "2023-05-30",
  "estado": "publicada",
  "activa": true
}
```

#### Subir archivo de bases para una convocatoria
```
POST /api/convocatorias/1/archivos
Content-Type: multipart/form-data
Authorization: Bearer <token>

- tipo_archivo: "bases"
- nombre: "Bases del proceso CAS N° 001-2023"
- archivos: [archivo1.pdf]
```

#### Subir resultados de evaluación curricular
```
POST /api/convocatorias/1/archivos
Content-Type: multipart/form-data
Authorization: Bearer <token>

- tipo_archivo: "resultado_curricular"
- nombre: "Resultados de evaluación CV - CAS N° 001-2023"
- archivos: [archivo1.pdf, archivo2.xlsx]
```

#### Obtener una convocatoria con todos sus archivos
```
GET /api/convocatorias/1
```

Respuesta:
```json
{
  "convocatoria": {
    "id": 1,
    "tipo_id": 1,
    "tipo_nombre": "CAS",
    "nombre_proceso": "Convocatoria CAS N° 001-2023",
    "descripcion": "Proceso de selección...",
    "fecha_inicio": "2023-05-01",
    "fecha_fin": "2023-05-30",
    "estado": "publicada",
    "activa": true,
    "created_at": "2023-05-01T10:00:00.000Z",
    "updated_at": "2023-05-01T10:00:00.000Z"
  },
  "archivos": {
    "bases": [
      {
        "id": 1,
        "nombre": "Bases del proceso CAS N° 001-2023",
        "archivo_url": "http://localhost:5000/public/uploads/...",
        "orden": 0,
        "created_at": "2023-05-01T10:15:00.000Z"
      }
    ],
    "resultado_curricular": [
      {
        "id": 2,
        "nombre": "Resultados de evaluación CV - CAS N° 001-2023",
        "archivo_url": "http://localhost:5000/public/uploads/...",
        "orden": 0,
        "created_at": "2023-05-15T14:30:00.000Z"
      }
    ],
    "resultado_entrevista": [],
    "resultado_final": [],
    "comunicado": []
  }
}
```

#### Eliminar un archivo de convocatoria
```
DELETE /api/convocatorias/1/archivos/2
Authorization: Bearer <token>
```

