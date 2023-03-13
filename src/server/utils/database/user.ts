import { prisma } from "../../db";

export const getAllReviewers = async () => {
  return await prisma.user.findMany();
};

export const userExists = async (id: string) => {
  return (await prisma.user.count({ where: { id: id } })) > 0;
};

export const getUserById = async (id: string) => {
  return await prisma.user.findFirst({ where: { id: id } });
};

export const getUserByName = async (name: string) => {
  return await prisma.user.findFirst({ where: { name: name } });
};

export const findAllUsers = async () => {
  return await prisma.user.findMany();
};
