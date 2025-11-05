import * as requirementService from "../services/requirementService.js";

export const createRequirement = async (req, res, next) => {
  try {
    const user = req.user;
    const ip = req.ip;
    const data = req.body;
    const requirement = await requirementService.createRequirement(
      user,
      ip,
      data
    );

    return res.status(201).json({
      message: "Requerimiento creado exitosamente.",
      success: true,
      data: requirement,
    });
  } catch (error) {
    next(error);
  }
};

export const getRequirements = async (req, res, next) => {
  try {
    const user = req.user;
    const requirements = await requirementService.getRequirements(user);
    return res.status(200).json({
      message: "Requerimientos obtenidos exitosamente.",
      success: true,
      data: requirements,
    });
  } catch (error) {
    next(error);
  }
};

export const getRequirementById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const requirement = await requirementService.getRequirementById(id);
    return res.status(200).json({
      message: "Requerimiento obtenido exitosamente.",
      success: true,
      data: requirement,
    });
  } catch (error) {
    next(error);
  }
};

export const singTIAnalysis = async (req, res, next) => {
  try {
    const user = req.user;
    const id = req.params.id;
    const data = req.body;
    const analysis = await requirementService.singTIAnalysis(user, id, data);
    return res.status(200).json({
      message: "Análisis agregado exitosamente.",
      success: true,
      data: analysis,
    });
  } catch (error) {
    next(error);
  }
};

export const singRHPayment = async (req, res, next) => {
  try {
    const user = req.user;
    const ip = req.ip;
    const id = req.params.id;
    const analysisData = req.body;
    const payment = await requirementService.singRHPayment(
      user,
      id,
      ip,
      analysisData
    );
    return res.status(200).json({
      message: "Pago aprobado existosamente.",
      success: true,
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

export const singTIReady = async (req, res, next) => {
  try {
    const user = req.user;
    const id = req.params.id;
    const sing = req.body;
    const ready = await requirementService.singTIReady(user, id, sing);
    return res.status(200).json({
      message: "El requerimiento esta listo para aprobar entrega.",
      success: true,
      data: ready,
    });
  } catch (error) {
    next(error);
  }
};

export const singRHDelivery = async (req, res, next) => {
  try {
    const user = req.user;
    const id = req.params.id;
    const sing = req.body;
    const delivery = await requirementService.singRHDelivery(user, id, sing);
    return res.status(200).json({
      message: "Se aprobó la entrega exitosamente.",
      success: true,
      data: delivery,
    });
  } catch (error) {
    next(error);
  }
};

export const createAndLinkAsset = async (req, res, next) => {
  try {
    const user = req.user;
    const id = req.params.id;
    const { is_equipo, asset_details } = req.body;
    const result = await requirementService.createAndLinkAsset(
      id,
      user,
      is_equipo,
      asset_details
    );
    return res.status(201).json({
      message: "Dispositivos creados y asignados exitosamente.",
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const cancelRequirement = async (req, res, next) => {
  try {
    const user = req.user;
    const id = req.params.id;
    const cancel = await requirementService.cancelRequirement(user, id);
    return res.status(200).json({
      message: "Requerimiento cancelado exitosamente.",
      success: true,
      data: cancel,
    });
  } catch (error) {
    next(error);
  }
};
