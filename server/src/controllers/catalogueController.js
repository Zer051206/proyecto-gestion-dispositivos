/**
 * @file catalogueController.js
 * @description Controladores para las rutas de consulta de catálogos e historiales.
 */
import * as catalogueService from "../services/catalogueService";

export const getDevicesHistorial = async (req, res, next) => {
  try {
    const devicesHistorial = await catalogueService.fetchDevicesHistorial();

    res.status(200).json(devicesHistorial);
  } catch (error) {
    next(error);
  }
};

export const getPeopleHistorial = async (req, res, next) => {
  try {
    const peopleHistorial = await catalogueService.fetchPeopleHistorial();

    res.status(200).json(peopleHistorial);
  } catch (error) {
    next(error);
  }
};

export const getAssignmentsHistorial = async (req, res, next) => {
  try {
    const assignmentHistorial =
      await catalogueService.fetchAssignmentsHistorial();

    res.status(200).json(assignmentHistorial);
  } catch (error) {
    next(error);
  }
};
