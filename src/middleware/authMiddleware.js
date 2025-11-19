import jwt from 'jsonwebtoken';
import HttpException from '../exception/HttpException.js';
import ForbiddenException from '../exception/ForbiddenException.js';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    throw new HttpException(401, 'Access token required');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    throw new HttpException(401, 'Invalid or expired token');
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user) {
    throw new HttpException(401, 'Authentication required');
  }

  if (req.user.role !== 'ADMIN') {
    throw new ForbiddenException('Admin access required');
  }

  next();
}