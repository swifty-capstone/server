import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import HttpException from '../../utils/http/Exception.js';

const prisma = new PrismaClient();

export async function registerUser({ email, password }) {
  if (!email || !password) throw new HttpException(400, 'Email and password are required');

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new HttpException(400, 'Email already exists');

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: { email, password: hashedPassword },
  });

  return { id: user.id, email: user.email };
}

export async function setUsername(userId, username) {
  if (!username) throw new HttpException(400, 'Username is required');

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { username },
  });

  return { id: updatedUser.id, username: updatedUser.username };
}

export async function getUser(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new HttpException(404, 'User not found');

  return {
    id: user.id,
    email: user.email,
    username: user.username || '???',
  };
}