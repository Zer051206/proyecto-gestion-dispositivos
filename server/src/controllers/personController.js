import * as personService from "../services/personService.js";
import updatePersonSchema from "../schemas/personSchema.js";

export const getPersonHistorial = async (req, res, next) => {
  try {
    const personHistorial = await personService.getPersonHistorial();
    return res.status(200).json(personHistorial);
  } catch (error) {
    next(error);
  }
};

export const updatePerson = async (req, res, next) => {
  try {
    const updateValidateData = updatePersonSchema.parse(req.body);
    const updatedPerson = await personService.updatePerson(updateValidateData);
    return res.status(200).json(updatedPerson);
  } catch (error) {
    next(error);
  }
};
