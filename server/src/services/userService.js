import * as userRepository from "../repositories/userRepository.js";
import { NotFoundError, UserAlreadyExistsError } from "../utils/customErrors";

export const getAllUsers = async () => {
  const allUsers = await userRepository.findAll();
  return allUsers;
};

export const getUserById = async (id) => {
  const user = await userRepository.findById(id);
  return user;
};

export const createUser = async (createData) => {
  const { correo } = createData;

  const userDb = await userRepository.findByEmail(correo);

  if (userDb) {
    throw new UserAlreadyExistsError();
  }

  const newUser = await userRepository.create(createData);

  return newUser;
};

export const updateUser = async (updateData) => {
  const { correo } = updateData;
  const userDb = await userRepository.findByEmail(correo);
  if (!userDb) {
    throw new NotFoundError("Usuario no encontrado.");
  }
  const updatedUser = await userRepository.update(updateData);

  return updatedUser;
};
