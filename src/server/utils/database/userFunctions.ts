import { prisma } from "../../db";

const getUserById = async (id: string) => {
  return await prisma.user.findFirst({ where: { id: id } });
};

const getUserByName = async (name: string) => {
  return await prisma.user.findFirst({ where: { name: name } });
};

const findAllUsers = async () => {
  return await prisma.user.findMany();
};

export { getUserById, getUserByName, findAllUsers };
