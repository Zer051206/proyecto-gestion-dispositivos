/**
 * @file detailConfigs.js
 * @description Contiene las configuraciones estáticas para renderizar los detalles
 * de los diferentes modelos (activos, usuarios, centros de operación, logs)
 * en el componente DetailModal.
 * * NOTA: Los 'keys' anidados (ej. 'OperationCenter.codigo') son manejados
 * por la función 'getNestedValue' dentro del componente DetailModal.
 * * Se asume la existencia de helpers de formato:
 * - formatStatus: Convierte booleano a "Sí"/"No" (o Activo/De Baja)
 * - formatDeviceType: Convierte booleano a "Laptop"/"PC de Escritorio"
 * - formatDate: Formatea un string de fecha/timestamp.
 */

// **********************************************
// --- CONFIGURACIONES DE ACTIVOS (EQUIPOS/PERIFÉRICOS) ---
// **********************************************

/**
 * @function formatStatus
 * @description Convierte un valor booleano general (Sí/No).
 * @param {boolean} value
 * @returns {string}
 */
const formatStatus = (value) => (value ? "Sí" : "No");

/**
 * @function formatActiveStatus
 * @description Convierte un valor booleano de estado de activo (Activo/De Baja).
 * @param {boolean} value
 * @returns {string}
 */
const formatActiveStatus = (value) => (value ? "Activo" : "De Baja");

/**
 * @function formatDeviceType
 * @description Convierte el booleano 'equipo_laptop' a su tipo de texto.
 * @param {boolean} value
 * @returns {string}
 */
const formatDeviceType = (value) => (value ? "Laptop" : "PC de Escritorio");

/**
 * @const {Array<object>} deviceConfig
 * @description Configuración para el DetailModal de un Equipo.
 */
export const deviceConfig = [
  { label: "Serial", key: "serial" },
  { label: "Tipo de Equipo", key: "equipo_laptop", format: formatDeviceType },
  { label: "Estado", key: "estado_equipo", format: formatActiveStatus },
  { label: "Activo Fijo", key: "activo_fijo", format: formatStatus },
  { label: "Código Activo Fijo", key: "codigo_activo_fijo", conditional: true },

  { label: "Disco Duro (GB)", key: "tamano_disco_duro" },
  {
    label: "T. Gráfica Instalada",
    key: "equipo_tarjeta_grafica",
    format: formatStatus,
  },
  {
    label: "Referencia T. Gráfica",
    key: "referencia_tarjeta_grafica",
    conditional: true,
  },
  { label: "Serial Pantalla", key: "serial_pantalla", conditional: true },

  { label: "Alquilado", key: "equipo_alquilado", format: formatStatus },
  { label: "Empresa Alquila", key: "empresa_alquila", conditional: true },

  { label: "Centro de Operación (Código)", key: "OperationCenter.codigo" },
  {
    label: "Centro de Costos (Código)",
    key: "CentroCosto.codigo_centro_costo",
    conditional: true,
  },
  { label: "Registrado por", key: "Creador.nombre" },
];

/**
 * @const {Array<object>} peripheralConfig
 * @description Configuración para el DetailModal de un Periférico.
 */
export const peripheralConfig = [
  { label: "Serial", key: "serial_periferico" },
  { label: "Tipo", key: "PeripheralType.tipo_periferico" },
  { label: "Marca", key: "marca_periferico" },
  { label: "Estado", key: "estado_periferico", format: formatActiveStatus },
  { label: "Activo Fijo", key: "activo_fijo", format: formatStatus },
  { label: "Código Activo Fijo", key: "codigo_activo_fijo", conditional: true },

  { label: "Centro de Operación (Código)", key: "OperationCenter.codigo" },
  {
    label: "Centro de Costos (Código)",
    key: "CentroCosto.codigo_centro_costo",
    conditional: true,
  },
  { label: "Registrado por", key: "Creador.nombre" },
];

/**
 * @const {Array<object>} bajaConfig
 * @description Configuración para el DetailModal de un registro de Baja.
 */
export const bajaConfig = [
  { label: "Fecha de Baja", key: "fecha_baja", format: "date" }, // Se mantiene como string "date"
  { label: "Dado de Baja por", key: "Usuario.nombre" },
  { label: "Serial Equipo", key: "Equipo.serial", conditional: true },
  {
    label: "Serial Periférico",
    key: "Periferico.serial_periferico",
    conditional: true,
  },
];

// **********************************************
// --- CONFIGURACIONES DE GESTIÓN (USUARIO / CO / LOG) ---
// **********************************************

/**
 * @const {Array<object>} userConfig
 * @description Configuración para el DetailModal de un Usuario.
 */
export const userConfig = [
  { label: "Nombre Completo", key: "nombre" },
  { label: "Apellido", key: "apellido", conditional: true },
  { label: "Correo", key: "correo" },
  { label: "Rol", key: "rol" },
  { label: "Tipo ID", key: "IdentificationType.tipo_identificacion" },
  { label: "Identificación", key: "identificacion" },
  { label: "Teléfono", key: "telefono", conditional: true },
  { label: "Activo", key: "activo", format: formatStatus },
  {
    label: "Último Login",
    key: "ultimo_login",
    format: "date",
    conditional: true,
  }, // Se mantiene como string "date"
  { label: "Creado por", key: "Creador.nombre", conditional: true },
  {
    label: "Centro de Operación",
    key: "OperationCenter.codigo",
    conditional: true,
  },
];

/**
 * @const {Array<object>} centroOperacionConfig
 * @description Configuración para el DetailModal de un Centro de Operación (CO).
 */
export const centroOperacionConfig = [
  { label: "Código CO", key: "codigo" },
  { label: "Ciudad", key: "Ciudad.nombre_ciudad" },
  { label: "Dirección", key: "direccion" },
  { label: "Teléfono", key: "telefono" },
  { label: "Correo", key: "correo" },
  { label: "Activo", key: "activo", format: formatStatus },
  { label: "Creado por", key: "AdminCreador.nombre" },
];

/**
 * @const {Array<object>} logConfig
 * @description Configuración para el DetailModal de un registro de Log.
 */
export const logConfig = [
  { label: "Fecha", key: "fecha_log", format: "date" },
  { label: "Acción", key: "accion" },
  { label: "Usuario", key: "Usuario.nombre" },
  { label: "ID Usuario", key: "id_usuario" },
  { label: "IP", key: "ip_usuario" },
  { label: "Descripción", key: "descripcion", conditional: true },
];
