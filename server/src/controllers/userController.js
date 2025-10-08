import * as userService from "../services/userService.js";
import { createUserSchema, updateUserSchema } from "../schemas/userSchema.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const allUsers = await userService.getAllUsers();
    return res.status(200).json(allUsers);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const id_admin = req.admin.id_admin;
    const createValidateData = createUserSchema.parse(req.body);
    const newUser = await userService.createUser(createValidateData, id_admin);
    return res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { id_usuario } = req.params;
    const updateValidateData = updateUserSchema.parse(req.body);
    const updatedUser = await userService.updateUser(
      updateValidateData,
      id_usuario
    );
    return res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};
