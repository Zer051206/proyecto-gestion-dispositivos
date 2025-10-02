import db from "../models/index.js";

const Person = db.Person;

export const findByIdentificacion = async (identificacion) => {
  return Person.findOne({
    where: { identificacion: identificacion },
  });
};

export const createPerson = async (personData, options = {}) => {
  return Person.create(personData, options);
};

/**
 * @async
 * @function updatePerson
 * @description Actualiza los datos de una persona por su ID.
 * @param {number} id_persona - ID de la persona a actualizar.
 * @param {object} personData - Objeto con los campos a actualizar (usando updatePersonSchema.partial()).
 * @param {object} [options={}] - Opciones de Sequelize (para la transacción).
 * @returns {Promise<Array<number>>} Array con el número de filas afectadas (ej: [1]).
 */
export const updatePerson = async (id_persona, personData, options = {}) => {
  // personData solo contiene los campos que el usuario quiere modificar.
  return Person.update(
    personData, // Los valores SET
    {
      where: { id_persona: id_persona },
      ...options, // Pasa la transacción si existe
    }
  );
};
