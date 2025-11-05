import * as requirementRepository from "../repositories/requirementRepository.js";
import db from "../models/index.js";
import {
  ConfigurationError,
  DuplicateError,
  ForbiddenError,
  NotFoundError,
} from "../utils/customErrors.js";

const INITIAL_STATUS_CODE = "PENDIENTE_TI_ANALISIS";
const SECOND_STATUS_CODE = "PENDIENTE_RH_PAGO";

export const createRequirement = async (user, ip, data) => {
  const initialStatus = await db.RequirementStatus.findOne({
    where: { nombre_estado: INITIAL_STATUS_CODE },
    attributes: ["id_estado_requerimiento"],
  });

  if (!initialStatus) {
    throw new ConfigurationError(
      "`El estado inicial '${INITIAL_STATUS_CODE}' no fue encontrado en el catálogo.`"
    );
  }

  const initialStatusId = initialStatus.id_estado_requerimiento;

  return db.sequelize.transaction(async (t) => {
    const { codigo_requerimiento } = data;

    const requirementDb = await requirementRepository.findByCode(
      codigo_requerimiento,
      { transaction: t }
    );

    if (requirementDb) {
      throw new DuplicateError(
        "Ya existe un requerimiento con el mismo código."
      );
    }

    const requirementData = {
      ...data,
      id_centro_operacion: user.id_centro_operacion,
      id_estado_requerimiento: initialStatusId,
      fk_firmante_co_id: user.id_usuario,
      fecha_firma_co: new Date(),
    };

    const newRequirement = await requirementRepository.create(requirementData, {
      transaction: t,
    });

    await db.Log.create(
      {
        accion: "CREAR_REQUERIMIENTO",
        ip_usuario: ip,
        descripcion: `Se creó el requerimiento '${newRequirement.codigo_requerimiento}' (ID: ${newRequirement.id_requerimiento}).`,
        id_usuario: user.id_usuario,
      },
      { transaction: t }
    );

    return newRequirement;
  });
};

export const getRequirements = async (user) => {
  if (user.rol !== "Admin") {
    const requirements = await requirementRepository.findByUser(
      user.id_usuario
    );
    if (requirements.length > 0) {
      return requirements;
    }
    return [];
  } else if (user.rol === "Admin") {
    const requirements = await requirementRepository.findAll();
    if (requirements.length > 0) {
      return requirements;
    }
    return [];
  }
  return [];
};

export const getRequirementById = async (id) => {
  const requirement = await requirementRepository.findById(id);
  if (requirement.length > 0) {
    return requirement;
  }
  return [];
};

export const singTIAnalysis = async (user, id, ip, analysisData) => {
  return db.sequelize.transaction(async (t) => {
    const currentRequirement = await requirementRepository.findById(id, {
      transaction: t,
    });

    if (!currentRequirement) {
      throw new NotFoundError(`Requerimiento con ID ${id} no encontrado.`);
    }

    // Asumiendo que el estado actual para la firma debe ser PENDIENTE_TI_ANALISIS (ID 1)
    if (currentRequirement.id_estado_requerimiento !== 1) {
      throw new ForbiddenError(
        "El requerimiento no se encuentra en el estado 'PENDIENTE_TI_ANALISIS' para ser firmado."
      );
    }

    const secondStatus = await db.RequirementStatus.findOne({
      where: { nombre_estado: SECOND_STATUS_CODE },
      attributes: ["id_estado_requerimiento"],
      transaction: t, // Aunque es de catálogo, la incluimos por consistencia
    });

    if (!secondStatus) {
      throw new Error(
        `Error de configuración: El estado '${SECOND_STATUS_CODE}' no fue encontrado.`
      );
    }
    const secondStatusId = secondStatus.id_estado_requerimiento;

    const data = {
      ...analysisData,
      id_requerimiento: id,
      fk_analista_ti_id: user.id_usuario,
    };

    const analysis = await requirementRepository.createAnalysis(data, {
      transaction: t,
    });

    const updateData = {
      presupuesto_estimado: analysisData.presupuesto_estimado,
      fk_firmante_ti_analisis_id: user.id_usuario,
      fecha_firma_ti_analisis: new Date(),
      id_estado_requerimiento: secondStatusId,
    };

    await requirementRepository.update(id, updateData, {
      transaction: t,
    });

    await db.Log.create(
      {
        accion: "ANALISIS_TI_APROBADO",
        ip_usuario: ip,
        descripcion: `Se completó el análisis del requerimiento '${currentRequirement.codigo_requerimiento}' (ID: ${id}). Nuevo estado: ${SECOND_STATUS_CODE}.`,
        id_usuario: user.id_usuario,
      },
      { transaction: t }
    );

    return analysis;
  });
};
