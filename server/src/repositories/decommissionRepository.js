import db from "../models/index.js";

const Decomission = db.Decomission;

export const create = async (decomissionData, options = {}) => {
  return Decomission.create(decomissionData, options);
};
