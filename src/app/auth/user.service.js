import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import HttpException from '../../utils/http/Exception.js';

const prisma = new PrismaClient();

export async function registerUser({ student_id, password, name, email, class: userClass, grade }) {
  if (!student_id || !password) throw new HttpException(400, 'Student ID and password are required');

  const existing = await prisma.users.findUnique({ where: { student_id: String(student_id) } });
  if (existing) throw new HttpException(400, 'Student ID already exists');

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.users.create({
    data: { 
      student_id: String(student_id), 
      password: hashedPassword,
      name: name || null,
      email: email || null,
      class: userClass || null,
      grade: grade || null
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
