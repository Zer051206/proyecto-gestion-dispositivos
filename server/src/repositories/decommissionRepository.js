import db from "../models/index.js";

const User = db.User;
const Device = db.Device;
const Peripheral = db.Peripheral;
const Decomission = db.Decomission;

export const findAll = async (options = {}) => {
  return Decomission.findAll({
    include: [
      {
        model: User,
        attributes: ["nombre", "apellido"],
      },
      {
        model: Device,
        attributes: ["serial"],
      },
      {
        model: Peripheral,
        attributes: ["serial_periferico"],
      },
    ],
    ...options,
  });
};

export const findAllById = async (id_usuario) => {
  return Decomission.findAll({
    where: { id_usuario: id_usuario },
    include: [
      { model: User, attributes: ["nombre", "apellido", "rol"] },
      { model: Peripheral, attributes: ["serial_periferico"] },
      { model: Device, attributes: ["serial"] },
    ],
  });
};

export const create = async (decomissionData, options = {}) => {
  return Decomission.create(decomissionData, options);
};
