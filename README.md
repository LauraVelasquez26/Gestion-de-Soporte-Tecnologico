# 🛠️ Sistema de Gestión de Solicitudes de Soporte Tecnológico
> **Prueba Técnica — Desarrollador de Software Full Stack Junior**

Este proyecto es una solución web Full Stack desarrollada para gestionar solicitudes de soporte tecnológico interno en una organización. Incluye control de estados, registro automático de auditoría en historial, filtrado, ordenamiento, paginación, búsqueda en tiempo real y cumplimiento estricto de las reglas de negocio solicitadas.

---

## 📋 Tabla de Contenidos
1. [Justificación de Arquitectura y Decisiones Técnicas](#1-justificación-de-arquitectura-y-decisiones-técnicas)
2. [Estructura del Proyecto y Separación de Responsabilidades](#2-estructura-del-proyecto-y-separación-de-responsabilidades)
3. [Reglas de Negocio y Transiciones de Estado](#3-reglas-de-negocio-y-transiciones-de-estado)
4. [Validaciones Implementadas (Backend & Frontend)](#4-validaciones-implementadas-backend--frontend)
5. [Guía de Instalación y Ejecución](#5-guía-de-instalación-y-ejecución)
6. [Instrucciones para MySQL Workbench](#6-instrucciones-para-mysql-workbench)

---

## 1. Justificación de Arquitectura y Decisiones Técnicas

### 🏗️ Arquitectura Seleccionada: **Arquitectura de Microservicios Modulares (Microservices Architecture)**
Para esta solución se estructuró una **Arquitectura basada en Microservicios Modulares**, donde el sistema se divide en servicios desacoplados con responsabilidades independientes bajo el concepto de **Contextos Delimitados (Bounded Contexts)**.

#### ¿Por qué esta arquitectura?
- **Desacoplamiento Funcional**: El **Servicio de Gestión de Tickets** opera de forma independiente al **Servicio de Auditoría e Historial**, permitiendo que las operaciones de consulta y actualización de soporte no bloqueen el registro histórico.
- **Escalabilidad Independiente**: En un entorno de producción, la API de Tickets puede escalar horizontalmente para soportar alta demanda de solicitudes, mientras que el servicio de auditoría puede procesar eventos de trazabilidad de manera asíncrona.
- **Facilidad de Mantenimiento**: Cada microservicio administra su propio contrato de datos (DTOs/Serializers) e impone sus propias reglas de negocio mediante validadores especializados (`validators.py`).

---

## 2. Estructura del Proyecto y Separación de Servicios

```
soporte_tecnico/
├── backend/                        # NÚCLEO DE MICROSERVICIOS BACKEND
│   ├── soporte_project/            # API Gateway & Enrutador Principal (CORS, URLs globales)
│   ├── tickets/                    # MICROSERVICIOS DE NEGOCIO (App tickets)
│   │   ├── models.py               # Entidades de Dominio (Solicitud & HistorialSolicitud)
│   │   ├── validators.py           # Motor de Reglas de Negocio y Transiciones de Estado
│   │   ├── serializers.py          # Contratos de Interfaz (DTOs de Entrada y Salida)
│   │   ├── views.py                # Microservicios REST (Endpoints de Tickets, Historial y Stats)
│   │   └── urls.py                 # Rutas de Servicio
│   ├── schema.sql                  # Script DDL de Base de Datos para MySQL Workbench
│   ├── seed.sql                    # Script DML de datos iniciales
│   └── requirements.txt            # Servidor Python
├── frontend/                       # CLIENTE WEB DESACOPLADO (Microservicio React SPA)
│   ├── src/
│   │   ├── components/             # Módulos Visuales (Tabla, Modales, KPIs, Filtros)
│   │   ├── api.js                  # Conector de Servicios HTTP
│   │   └── App.jsx                 # Orquestador del Cliente Web
│   ├── package.json
│   └── index.html
└── README.md                       # Documentación Técnica de Justificación
```

### Separación de Responsabilidades y Servicios

1. **Microservicio 1: Servicio de Gestión de Tickets (`Ticket Management Service`)**:
   - **Responsabilidad**: Creación, edición, filtrado multicampo, ordenamiento, paginación y cambio de estado de las solicitudes tecnológicas.
2. **Microservicio 2: Servicio de Auditoría e Historial (`Audit & History Service`)**:
   - **Responsabilidad**: Registro inmutable de trazabilidad, almacenamiento de estados anteriores/nuevos, estampa de tiempo y observaciones asociadas a cada evento.
3. **API Gateway & Enrutador (`API Gateway`)**:
   - **Responsabilidad**: Punto de contacto unificado en `http://127.0.0.1:8000/api/` que enruta las peticiones HTTP, gestiona CORS y aplica las políticas de seguridad.
4. **Cliente Frontend SPA (`React Web Client Service`)**:
   - **Responsabilidad**: Interfaz cliente independiente en `http://localhost:3000` que consume los microservicios mediante JSON asíncrono.

---

## 3. Reglas de Negocio y Transiciones de Estado

### Matriz de Transiciones de Estado Validada
```
[Pendiente]  ───►  [En progreso]  ───►  [Resuelta] (Estado Final)
     │                    │
     ▼                    ▼
[Cancelada]          [Cancelada] (Estado Final)
```

| Estado Actual | Estados Permitidos | Condición Especial |
|---|---|---|
| **Pendiente** | `En progreso`, `Cancelada` | Transición directa por operador o usuario |
| **En progreso** | `Resuelta`, `Cancelada` | Cierre o cancelación de solicitud |
| **Resuelta** | *Ninguno (Estado Terminal)* | Si la prioridad es **Crítica**, exige **Observación Obligatoria** |
| **Cancelada** | *Ninguno (Estado Terminal)* | No puede volver a estar en progreso ni editarse |

---

## 4. Validaciones Implementadas (Backend & Frontend)

### Frontend (Validaciones de UX)
- **Formulario de Creación/Edición**: Título obligatorio (mínimo 5 caracteres), usuario solicitante y descripción obligatoria.
- **Modal de Estado**: Restringe los estados seleccionables según el estado actual de la solicitud. Exige observación cuando la prioridad es `Crítica` y se marca como `Resuelta`.

### Backend (Validaciones con `Validators` y `ValidationError` de Django)
- `validar_transicion_estado(estado_actual, estado_nuevo)`: Lanza un `ValidationError` si se intenta saltar un estado o reabrir una solicitud cerrada.
- `validar_observacion_resolucion_critica(prioridad, estado_nuevo, observacion)`: Lanza un `ValidationError` si falta la observación en un ticket de prioridad Crítica.
- `SolicitudSerializer.update()`: **Regla Adicional de Inmutabilidad**: Impide la edición de campos originales en solicitudes en estado `Resuelta` o `Cancelada`.

---

### 🌟 Regla de Negocio Adicional Implementada y su Justificación

**Inmutabilidad de Solicitudes en Estado Final (`Resuelta` / `Cancelada`)**:
- **Regla**: El sistema bloquea cualquier intento de editar el título, descripción, categoría o prioridad de un ticket que ya fue resuelto o cancelado, tanto en la interfaz React como en el backend Django (`SolicitudSerializer.update()`).
- **Justificación**: Garantiza la **integridad de los datos** y la validez del historial de auditoría. Si un ticket ya fue cerrado, modificar la descripción o categoría original alteraría el diagnóstico histórico y desvirtuaría los indicadores SLA (Service Level Agreement) de la organización.

---

## 5. Guía de Instalación y Ejecución

### 1️⃣ Ejecutar el Backend (Python / Django)
```bash
# Navegar a la carpeta backend
cd backend

# (Opcional) Instalar dependencias si no están instaladas
pip install -r requirements.txt

# Aplicar migraciones e inicializar datos de prueba
python manage.py migrate
python populate_data.py

# Iniciar el servidor de desarrollo en el puerto 8000
python manage.py runserver 8000
```
> El backend estará disponible en `http://127.0.0.1:8000/api/tickets/`

### 2️⃣ Ejecutar el Frontend (React / Vite)
```bash
# Navegar a la carpeta frontend
cd frontend

# Instalar dependencias npm
npm install

# Iniciar el servidor frontend Vite
npm run dev
```
> La interfaz web abrirá en `http://localhost:3000/`

---

## 6. Instrucciones para MySQL Workbench

Si deseas conectar el proyecto a tu instancia local de MySQL Workbench:

1. Abre **MySQL Workbench** y abre una nueva pestaña de Query.
2. Ejecuta el archivo `backend/schema.sql` para crear la base de datos `soporte_tecnico_db` y sus tablas.
3. Ejecuta el archivo `backend/seed.sql` para insertar los datos iniciales de prueba.
4. Para indicarle a Django que use tu MySQL local en lugar del SQLite embebido, establece las variables de entorno en tu consola:
   ```bash
   set USE_MYSQL=True
   set DB_USER=root
   set DB_PASSWORD=tu_contraseña
   set DB_HOST=localhost
   set DB_PORT=3306
   python manage.py runserver 8000
   ```
