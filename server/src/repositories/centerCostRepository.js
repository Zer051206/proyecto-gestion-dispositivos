/**
 * @file costCenterRepository.js
 * @module Repositories
 * @description Capa de acceso a datos para la entidad 'CenterCost' (Centro de Costo).
 * Este módulo encapsula las consultas a la base de datos relacionadas con los centros de costo.
 * @requires ../models/index.js
 */
import db from "../models/index.js";
const CenterCost = db.CenterCost;
const OperationCenter = db.OperationCenter;
const City = db.City;

export const create = async (centerCostData, options = {}) => {
  return await CenterCost.create(centerCostData, options);
}

export const findAll = async (options = {}) => {
  return await CenterCost.findAll({
    include: [
      {
        model: OperationCenter,
        attributes: ['id_centro_operacion', 'codigo', 'direccion'],
        include: [
          {
            model: City,
            attributes: ['id_ciudad', 'nombre_ciudad'],
          },
        ],
      },
    ],
    ...options,
  });
}

export const findByCode = async (code, options = {}) => {
  return await CenterCost.findOne({
    where: { codigo_centro_costo: code },
    ...options,
  });
}

/**
 * @async
 * @function findAllByCenterOperation
 * @description Busca y devuelve todos los centros de costo asociados a un centro de operación específico.
 * @param {number} id_centro_operacion - El ID del centro de operación por el cual filtrar.
 * @returns {Promise<Array<CostCenter>>} Un array de todos los objetos de centro de costo encontrados para el centro de operación dado.
 */
export const findAllByCenterOperation = async (id_centro_operacion) => {
  return CenterCost.findAll({
    where: { id_centro_operacion: id_centro_operacion },
  });
};
