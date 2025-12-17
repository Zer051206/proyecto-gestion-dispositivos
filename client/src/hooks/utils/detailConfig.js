/**
 * @file detailConfigs.js
 * @description Contiene las configuraciones estáticas para renderizar los detalles
 * de los diferentes modelos (activos, usuarios, centros de operación, logs)
 * en el componente DetailModal.
 */

// **********************************************
// --- CONFIGURACIONES DE ACTIVOS (EQUIPOS/PERIFÉRICOS) ---
// **********************************************

/**
 * @function formatStatusRequirement
 * @description Mapea el nombre canónico del estado del requerimiento a una etiqueta descriptiva con emoji.
 * @param {string} nombreEstado
 * @returns {string}
 */
const formatStatusRequirement = (nombreEstado) => {
  switch (nombreEstado) {
    case "PENDIENTE_TI_ANALISIS":
      return "Pendiente Análisis TI";
    case "PENDIENTE_RH_PAGO":
      return "Pendiente Aprobación RH (Pago)";
    case "PENDIENTE_TI_ALISTAMIENTO":
      return "Pendiente Alistamiento TI";
    case "PENDIENTE_RH_ENTREGA":
      return "Pendiente Aprobación RH (Entrega)";
    case "ENTREGADO":
      return "Entregado/Cerrado";
    case "CANCELADO":
      return "Cancelado";
    case "RECHAZADO_TI":
      return "Rechazado por TI";
    case "RECHAZADO_RH":
      return "Rechazado por RH";
    default:
      return nombreEstado;
  }
};

/**
 * @function formatUser
 * @description Formatea el nombre completo de un usuario a partir de su objeto.
 * @param {object} user - Objeto de usuario con propiedades 'nombre' y 'apellido'.
 * @returns {string} Nombre completo o "N/A".
 */
const formatUser = (user) => {
  return user ? `${user.nombre} ${user.apellido}` : "N/A";
};

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
 * @function formatCurrency
 * @description Formatea un valor numérico como moneda (COP, por ejemplo).
 * @param {number|string} val
 * @returns {string}
 */
const formatCurrency = (val) => {
  return val ? `$${Number(val).toLocaleString("es-CO")}` : "No aplica";
};

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
    key: "CenterCost.codigo_centro_costo",
    conditional: true,
  },
  {
    label: "Registrado por",
    key: "Creador",
    format: formatUser,
  },
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
  { label: "Centro de Operación", key: "OperationCenter.direccion" },
  { label: "Ciudad", key: "OperationCenter.City.nombre_ciudad" },
  {
    label: "Centro de Costos",
    key: "CenterCost.centro_costo"
  },
  {
    label: "Registrado por",
    key: "Creador",
    format: formatUser,
  },
];

/**
 * @const {Array<object>} bajaConfig
 * @description Configuración para el DetailModal de un registro de Baja.
 */
export const bajaConfig = [
  { label: "Fecha de Baja", key: "fecha_baja", format: "date" },
  {
    label: "Dado de Baja por",
    key: "User",
    format: formatUser,
  },
  { label: "Serial Equipo", key: "Device.serial", conditional: true },
  {
    label: "Serial Periférico",
    key: "Peripheral.serial_periferico",
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
  },
  { label: "Creado por", key: "Creador.nombre", conditional: true },
  {
    label: "Centro de Operación",
    key: "CentroAsignado.codigo",
    conditional: true,
  },
];

/**
 * @const {Array<object>} centroOperacionConfig
 * @description Configuración para el DetailModal de un Centro de Operación (CO).
 */
export const centroOperacionConfig = [
  { label: "Código CO", key: "codigo" },
  { label: "Ciudad", key: "City.nombre_ciudad" },
  { label: "Dirección", key: "direccion" },
  { label: "Teléfono", key: "telefono" },
  { label: "Correo", key: "correo" },
  { label: "Activo", key: "activo", format: formatStatus },
  {
    label: "Creado por",
    key: "AdminCreador.nombre",
    format: (nombre, item) => `${nombre} ${item.AdminCreador?.apellido || ""}`,
  },
];

/**
 * @const {Array<object>} logConfig
 * @description Configuración para el DetailModal de un registro de Log.
 */
export const logConfig = [
  { label: "Fecha", key: "fecha_log", format: "date" },
  { label: "Acción", key: "accion" },
  {
    label: "Usuario",
    key: "User.nombre",
    format: (nombre, item) => `${nombre} ${item.User?.apellido || ""}`,
  },
  { label: "ID Usuario", key: "id_usuario" },
  { label: "IP", key: "ip_usuario" },
  { label: "Descripción", key: "descripcion", conditional: true },
];

/**
 * @function getRequerimientoDetailConfig
 * @description Genera la configuración de campos para el DetailModal de un Requerimiento.
 * Se unifica toda la lógica de campos y condiciones en esta función.
 * @param {object} requerimiento - El objeto completo del requerimiento con todas las asociaciones.
 * @returns {Array<object>} La configuración de campos a mostrar.
 */
export const getRequerimientoDetailConfig = (requerimiento, formatDate) => {
  if (!requerimiento || !requerimiento.Status) return [];

  const estado = requerimiento.Status.nombre_estado;
  let config = [];

  // --- MÓDULO 1: INFORMACIÓN BASE Y SOLICITANTE ---
  config.push(
    { label: "Código Req.", key: "codigo_requerimiento" },
    {
      label: "Estado Actual",
      key: "Status.nombre_estado",
      format: formatStatusRequirement,
    },
    { label: "Asunto", key: "asunto" },
    { label: "Centro de Operación", key: "CenterOfOperation.codigo" }
  );

  // 1A. Detalle de la Necesidad (Solo en estado inicial)
  if (estado === "PENDIENTE_TI_ANALISIS") {
    config.push({
      label: "Detalle de la Necesidad",
      key: "detalle_necesidad",
      multiline: true,
    });
  }

  config.push(
    { label: "Solicitante (CO)", key: "SignerCO", format: formatUser },
    {
      label: "Fecha Solicitud",
      key: "fecha_solicitud",
      format: (val) => formatDate(val),
    }
  );

  // --- MÓDULO 2: ANÁLISIS TÉCNICO Y PRESUPUESTO (CONDICIONAL) ---
  if (requerimiento.TechnicalAnalysis) {
    config.push(
      { label: "--- ANÁLISIS TÉCNICO ---", isDivider: true },
      {
        label: "Analista TI",
        key: "TechnicalAnalysis.AnalistaTI",
        format: formatUser,
      },
      {
        label: "Fecha de Análisis",
        key: "TechnicalAnalysis.fecha_analisis",
        format: (val) => formatDate(val) || "N/A",
      },
      {
        label: "Equipos Requeridos",
        key: "TechnicalAnalysis.cantidad_equipos",
      },
      {
        label: "Periféricos Requeridos",
        key: "TechnicalAnalysis.cantidad_perifericos",
      },
      {
        label: "Presupuesto Final",
        key: "TechnicalAnalysis.presupuesto_final",
        format: formatCurrency,
      }
    );
  }

  // --- MÓDULO 3: SEGUIMIENTO Y APROBACIÓN (SIEMPRE VISIBLE) ---
  // Se muestran siempre, indicando "Pendiente" o "N/A" si la firma no ha ocurrido.
  config.push(
    // 3A. Firma TI (Análisis)
    {
      label: "Firmado TI (Análisis)",
      key: "SignerTIAnalysis",
      format: formatUser,
    },
    {
      label: "Fecha Firma TI",
      key: "fecha_firma_ti_analisis",
      format: (val) => formatDate(val) || "Pendiente",
    },
    // 3B. Firma RH (Pago)
    { label: "Firmado RH (Pago)", key: "SignerRHPayment", format: formatUser },
    {
      label: "Fecha Firma RH",
      key: "fecha_firma_rh_pago",
      format: (val) => formatDate(val) || "Pendiente",
    }
  );

  // --- MÓDULO 4: ENTREGA Y CIERRE (CONDICIONAL) ---
  if (
    ["PENDIENTE_RH_ENTREGA", "ENTREGADO"].includes(estado) ||
    requerimiento.fecha_aprobacion_rh_entrega
  ) {
    // Lógica para formatear Activos Asignados
    const assets = requerimiento.LinkedAssets || [];
    const assigned = assets
      .map((a) => {
        if (a.EquipoAsignado) return `Equipo: ${a.EquipoAsignado.serial}`;
        if (a.PerifericoAsignado)
          return `Periférico: ${a.PerifericoAsignado.marca_periferico} (${a.PerifericoAsignado.serial_periferico})`;
        return "Activo desconocido";
      })
      .join("\n");

    config.push(
      { label: "--- ENTREGA Y CIERRE ---", isDivider: true },
      { label: "Firmado TI (Listo)", key: "SignerTIReady", format: formatUser },
      {
        label: "Fecha Firma TI (Listo)",
        key: "fecha_firma_ti_listo",
        format: (val) => formatDate(val) || "Pendiente",
      },
      {
        label: "Aprobado RH (Entrega)",
        key: "SignerRHDelivery",
        format: formatUser,
      },
      {
        label: "Fecha Aprobación RH",
        key: "fecha_aprobacion_rh_entrega",
        format: (val) => formatDate(val) || "Pendiente",
      },
      {
        label: "Activos Asignados",
        key: "LinkedAssets",
        format: () => assigned || "Ninguno",
        multiline: true,
      }
    );
  }

  // --- MÓDULO 5: RECHAZO/CANCELACIÓN (CONDICIONAL) ---
  if (
    ["CANCELADO", "RECHAZADO_TI", "RECHAZADO_RH"].includes(estado) &&
    requerimiento.razon_rechazo
  ) {
    config.push(
      { label: "--- RAZÓN ---", isDivider: true },
      {
        label: "Razón de Rechazo/Cancelación",
        key: "razon_rechazo",
        multiline: true,
      }
    );
  }

  return config;
};
