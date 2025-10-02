// Archivo: assignmentService.js

import db from "../models/index.js";
import * as personRepository from "../repositories/personRepository.js";
import * as deviceRepository from "../repositories/deviceRepository.js";
import * as assignmentRepository from "../repositories/assignmentRepository.js";
import {
  AssignmentDontExistsError,
  IsAlreadyDeviceExistsError,
  IsAlreadyPersonExistsError,
} from "../utils/customErrors.js";

/**
 * @async
 * @function createAssignment
 * @description Crea una Persona, múltiples Dispositivos y sus respectivas Asignaciones
 * en una única transacción atómica.
 * @param {object} validatedData - Datos validados (personData y un arreglo de deviceData).
 * @returns {Promise<object>} Objeto con los datos de la persona, dispositivos y asignaciones creadas.
 */
export const createAssignment = async (validatedData) => {
  // 1. VERIFICACIONES PREVIAS (FUERA DE LA TRANSACCIÓN)
  const { personData, deviceData } = validatedData;

  // a) Verificar existencia de Persona
  const personDb = await personRepository.findByIdentificacion(
    personData.identificacion
  );
  if (personDb) {
    throw new IsAlreadyPersonExistsError(
      `La persona con ID ${personData.identificacion} ya existe.`
    );
  }

  // b) Verificar existencia de Dispositivos (Usamos Promise.all para revisar todos a la vez)
  const existingDevicesCheck = await Promise.all(
    deviceData.map((device) => deviceRepository.findBySerial(device.serial))
  );

  const alreadyExistsDevice = existingDevicesCheck.find(
    (device) => device !== null
  );
  if (alreadyExistsDevice) {
    throw new IsAlreadyDeviceExistsError(
      `El dispositivo con serial ${alreadyExistsDevice.serial} ya existe.`
    );
  }

  // 2. INICIAR TRANSACCIÓN (Solo si todas las verificaciones son exitosas)
  const t = await db.sequelize.transaction();

  try {
    // ----------------------------------------------------------------------
    // 3. CREAR PERSONA
    // ----------------------------------------------------------------------
    const newPerson = await personRepository.createPerson(personData, {
      transaction: t,
    });

    const newPersonId = newPerson.id_persona;
    const createdDevices = [];
    const createdAssignments = [];

    // ----------------------------------------------------------------------
    // 4. CREAR MÚLTIPLES DISPOSITIVOS Y ASIGNACIONES
    // ----------------------------------------------------------------------

    // Usamos un bucle 'for...of' o 'Promise.all' con la precaución de que aquí
    // las promesas SÍ DEBEN RESOLVERSE, pues la verificación ya se hizo.
    const deviceCreationPromises = deviceData.map(async (device) => {
      // 4a. Crear Dispositivo
      const newDevice = await deviceRepository.createDevice(device, {
        transaction: t,
      });

      // 4b. Crear Asignación (Aquí podrías agregar el closeActiveAssignmentByDeviceId si fuera necesario)
      const assignmentData = {
        id_persona: newPersonId,
        id_dispositivo: newDevice.id_dispositivo,
        fecha_asignacion: new Date(),
      };

      const newAssignment = await assignmentRepository.createAssignment(
        assignmentData,
        { transaction: t }
      );

      // Devolvemos los objetos creados para que Promise.all los recoja de forma segura
      return { newDevice, newAssignment };
    });

    // Esperamos a que todas las creaciones finalicen
    const results = await Promise.all(deviceCreationPromises);

    // Recolectamos los resultados de forma segura
    results.forEach((r) => {
      createdDevices.push(r.newDevice);
      createdAssignments.push(r.newAssignment);
    });

    // ----------------------------------------------------------------------
    // 5. COMMIT
    // ----------------------------------------------------------------------
    await t.commit();

    return {
      message: "Persona, dispositivos y asignaciones creadas exitosamente.",
      person: newPerson,
      devices: createdDevices,
      assignments: createdAssignments,
    };
  } catch (error) {
    // 6. ROLLBACK
    await t.rollback();
    throw error;
  }
};

export const finishAssignment = async (assignmentId) => {
  const assignmentDb = await assignmentRepository.findAssignmentById(
    assignmentId
  );
  if (assignmentDb.length === 0) {
    throw new AssignmentDontExistsError();
  }

  const finishedAssignment = await assignmentRepository.finishAssignment(
    assignmentId
  );

  return finishedAssignment;
};
