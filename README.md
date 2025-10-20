# Sistema de Gestión de Activos

Este repositorio contiene el código fuente para una aplicación full-stack de gestión de activos, diseñada para controlar y auditar equipos y periféricos dentro de una organización con múltiples centros de operación.

Descripción General

La aplicación permite a los administradores gestionar usuarios, centros de operación y el inventario completo, mientras que los usuarios con rol de "Encargado" tienen una vista restringida a los activos de su centro asignado.

Arquitectura

Backend: API RESTful construida con Node.js, Express, Sequelize y MariaDB.

Frontend: Single Page Application (SPA) construida con React, Vite y Tailwind CSS.

Características Principales

Gestión de Roles: Sistema de autenticación y autorización diferenciado para Admins y Encargados.

CRUD Completo: Funcionalidades para Crear, Leer y Actualizar todas las entidades principales.

Formularios Dinámicos: Interfaces para la creación masiva de activos y usuarios.

Auditoría: Módulo de historial para revisar logs de acciones y registros de bajas.

Exportación a Excel: Funcionalidad para exportar el inventario a un archivo .xlsx con hojas separadas.

Seguridad: Implementación de JWT (Access/Refresh Tokens), rate-limiting y protección de rutas.

Instalación y Uso

Backend (/server)

Navega a la carpeta server.

Ejecuta npm install.

Crea un archivo .env basado en las variables de configuración.

Ejecuta npm run dev para iniciar el servidor.

Frontend (/client)

Navega a la carpeta client.

Ejecuta npm install.

Ejecuta npm run dev para iniciar la aplicación.

Documentación
Para generar la documentación completa del proyecto, ejecuta el siguiente comando desde la carpeta raíz:

npm run docs

Esto creará la carpeta /docs con los sitios HTML para el backend y el frontend.
