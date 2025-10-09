import * as deviceRepository from "../repositories/deviceRepository.js";
import * as peripheralRepository from "../repositories/peripheralRepository.js";

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
