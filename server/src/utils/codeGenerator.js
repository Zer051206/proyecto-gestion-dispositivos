import * as requirementRepository from "../repositories/requirementRepository.js";
/**
 * @async
 * @function generateRequirementCode
 * @description Genera el código único del requerimiento: REQ-{CO_CODE}-{AÑO}{MES}{DIA}-{CONSECUTIVO}
 * Requiere el código del Centro de Operación del usuario.
 */
export const generateRequirementCode = async (centerOfOperationId) => {
  // Obtener el último consecutivo del día/mes/año
  const lastRequirement = await requirementRepository.findLastRequirementByCO(
    centerOfOperationId
  );

  let consecutive = 1;
  const today = new Date();
  const datePart = today.toISOString().slice(2, 10).replace(/-/g, ""); // YYMMDD

  // Lógica simple para incrementar el consecutivo (DEBE SER ROBUSTA EN EL REPOSITORIO)
  if (lastRequirement && lastRequirement.codigo_requerimiento) {
    const parts = lastRequirement.codigo_requerimiento.split("-");
    const lastDatePart = parts[2];

    if (lastDatePart === datePart) {
      const lastConsecutive = parseInt(parts[3]);
      consecutive = lastConsecutive + 1;
    }
  }

  return `REQ-${centerOfOperationId}-${datePart}-${consecutive}`;
};
