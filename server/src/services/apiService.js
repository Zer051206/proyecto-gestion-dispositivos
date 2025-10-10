import * as deviceRepository from "../repositories/deviceRepository.js";
import * as peripheralRepository from "../repositories/peripheralRepository.js";
import * as operationCenterRepository from "../repositories/operationCenterRepository.js";
import * as userRepository from "../repositories/userRepository.js";
import * as logRepository from "../repositories/logRepository.js";
import * as decomissionRepository from "../repositories/decommissionRepository.js";

export const getAssets = async (user) => {
  if (user.rol === "Admin") {
    const devices = await deviceRepository.findAll();
    const peripherals = await peripheralRepository.findAll();
    const typedDevices = devices.map((d) => ({
      ...d.dataValues,
      type: "device",
    }));
    const typedPeripherals = peripherals.map((p) => ({
      ...p.dataValues,
      type: "peripheral",
    }));
    return [...typedDevices, ...typedPeripherals];
  } else if (user.rol === "Encargado") {
    const id_centro_operacion = user.id_centro_operacion;
    if (!id_centro_operacion) {
      return [];
    }
    const devices = await deviceRepository.findByCenterId(id_centro_operacion);
    const peripherals = await peripheralRepository.findByCenterId(
      id_centro_operacion
    );
    const typedDevices = devices.map((d) => ({
      ...d.dataValues,
      type: "device",
    }));
    const typedPeripherals = peripherals.map((p) => ({
      ...p.dataValues,
      type: "peripheral",
    }));
    return [...typedDevices, ...typedPeripherals];
  }
  return [];
};

export const getOperationCenters = async () => {
  const operationCenters = await operationCenterRepository.findAll();
  if (!operationCenters) {
    return [];
  }
  return operationCenters;
};

export const getUsers = async () => {
  const users = await userRepository.findAll();
  if (!users) {
    return [];
  }
  return users;
};

export const getLogs = async (user) => {
  if (user.rol === "Admin") {
    const logs = await logRepository.findAll();
    if (!logs) {
      return [];
    }
    return logs;
  } else if (user.rol === "Encargado") {
    const logs = await logRepository.findAllById(user.id_usuario);
    if (!logs) {
      return [];
    }
    return logs;
  }
  return [];
};

export const getDecomissions = async (user) => {
  if (user.rol === "Admin") {
    const decomissions = await decomissionRepository.findAll();
    if (!decomissions) {
      return [];
    }
    return decomissions;
  } else if (user.rol === "Encargado") {
    const decomissions = await decomissionRepository.findAllById(
      user.id_usuario
    );
    if (!decomissions) {
      return [];
    }
    return decomissions;
  }
  return [];
};
