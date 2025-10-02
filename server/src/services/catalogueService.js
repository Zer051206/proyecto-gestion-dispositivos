import * as catalogueRepository from "../repositories/catalogueRepository.js";

export const fetchDevicesHistorial = async () => {
  const devicesHistorial = await catalogueRepository.fetchDevicesHistorial();
  return devicesHistorial;
};

export const fetchPeopleHistorial = async () => {
  const peopleHistorial = await catalogueRepository.fetchPeopleHistorial();
  return peopleHistorial;
};

export const fetchAssignmentsHistorial = async () => {
  const assignmentHistorial =
    await catalogueRepository.fetchAssignmentsHistorial();
  return assignmentHistorial;
};
