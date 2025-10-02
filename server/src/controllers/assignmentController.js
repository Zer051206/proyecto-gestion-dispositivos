import * as assignmentService from "../services/assignmentService.js";
import integratedAssignmentSchema from "../schemas/integratedAssignmentSchema.js";

export const createAssignment = async (req, res, next) => {
  try {
    const validateAssignmentData = integratedAssignmentSchema.parse(req.body);

    const createdAssignment = await assignmentService.createAssignment(
      validateAssignmentData
    );

    return res.status(201).json(createdAssignment);
  } catch (error) {
    next(error);
  }
};

export const finishAssignment = async (req, res, next) => {
  try {
    const assignmentId = req.body.id_asignacion;
    const finishedAssignment = await assignmentService.finishAssignment(
      assignmentId
    );
    return res.status(200).json(finishedAssignment);
  } catch (error) {
    next(error);
  }
};
