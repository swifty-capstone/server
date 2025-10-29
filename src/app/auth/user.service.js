import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import HttpException from '../../utils/http/Exception.js';
import { generateAccessToken, generateRefreshToken, getRefreshTokenExpiry } from '../../utils/token/jwt.js';

const prisma = new PrismaClient();

export async function registerUser({ student_id, password, name, email, class: userClass, grade }) {
  if (!student_id || !password) throw new HttpException(400, 'Student ID and password are required');
  if (!name || !email || userClass == null || grade == null) {
    throw new HttpException(400, 'name, email, class, grade are required');
  }

  const existing = await prisma.users.findUnique({ where: { student_id: String(student_id) } });
  if (existing) throw new HttpException(400, 'Student ID already exists');

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.users.create({
    data: { 
      student_id: String(student_id), 
      password: hashedPassword,
      name: name,
      email: email,
      class: userClass,
      grade: grade
    },
  });

  return { 
    id: user.id, 
    student_id: user.student_id,
    name: user.name,
    email: user.email,
    class: user.class,
    grade: user.grade
  };
}

export async function loginUser({ student_id, password }) {
  if (!student_id || !password) throw new HttpException(400, 'Student ID and password are required');

  const user = await prisma.users.findUnique({ 
    where: { student_id: String(student_id) } 
  });
  
  if (!user) throw new HttpException(401, 'Invalid credentials');

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new HttpException(401, 'Invalid credentials');

  await prisma.refresh_token.deleteMany({
    where: { user_id: user.id }
  });

  const accessToken = generateAccessToken({
    id: user.id,
    student_id: user.student_id,
    name: user.name
  });
  
  const refreshToken = generateRefreshToken();
  const expiryDatetime = getRefreshTokenExpiry();

  await prisma.refresh_token.create({
    data: {
      user_id: user.id,
      refresh_token: refreshToken,
      expiry_datetime: expiryDatetime
    }
  });

  return {
    user: {
      id: user.id,
      student_id: user.student_id,
      name: user.name,
      email: user.email,
      class: user.class,
      grade: user.grade
    },
    accessToken,
    refreshToken
  };
}

export async function refreshAccessToken(refreshToken) {
  if (!refreshToken) throw new HttpException(400, 'Refresh token is required');

  const tokenRecord = await prisma.refresh_token.findFirst({
    where: {
      refresh_token: refreshToken,
      expiry_datetime: {
        gt: new Date()
      }
    },
    include: {
      user: true
    }
  });

  if (!tokenRecord) throw new HttpException(401, 'Invalid or expired refresh token');

  await prisma.refresh_token.delete({
    where: { id: tokenRecord.id }
  });

  const newAccessToken = generateAccessToken({
    id: tokenRecord.user.id,
    student_id: tokenRecord.user.student_id,
    name: tokenRecord.user.name
  });
  
  const newRefreshToken = generateRefreshToken();
  const expiryDatetime = getRefreshTokenExpiry();

  await prisma.refresh_token.create({
    data: {
      user_id: tokenRecord.user.id,
      refresh_token: newRefreshToken,
      expiry_datetime: expiryDatetime
    }
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken
  };
}
