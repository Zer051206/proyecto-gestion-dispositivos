import db from "../models/index.js";

const Decomission = db.Decomission;

export const findAll = async (options = {}) => {
  return Decomission.findAll(options);
};

export const findAllById = async (id_usuario) => {
  return Decomission.findAll({
    where: { id_usuario: id_usuario },
  });
};

export const create = async (decomissionData, options = {}) => {
  return Decomission.create(decomissionData, options);
};
