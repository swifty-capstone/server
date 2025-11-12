import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import HttpException from '../../exception/HttpException.js';
import { generateAccessToken, generateRefreshToken, getRefreshTokenExpiry } from '../../utils/jwt.js';

class UserRepository {
  constructor(database = new PrismaClient()) {
    this.db = database;
  }

  async findByStudentId(studentId) {
    return this.db.users.findUnique({ 
      where: { student_id: String(studentId) } 
    });
  }

  async createUser(userData) {
    return this.db.users.create({ data: userData });
  }

  async deleteRefreshTokensByUserId(userId) {
    return this.db.refresh_token.deleteMany({
      where: { user_id: userId }
    });
  }

  async createRefreshToken(tokenData) {
    return this.db.refresh_token.create({ data: tokenData });
  }

  async findValidRefreshToken(token) {
    return this.db.refresh_token.findFirst({
      where: {
        refresh_token: token,
        expiry_datetime: { gt: new Date() }
      },
      include: { user: true }
    });
  }

  async deleteRefreshTokenById(id) {
    return this.db.refresh_token.delete({ where: { id } });
  }
}

class PasswordService {
  static async hash(password) {
    return bcrypt.hash(password, 12);
  }

  static async compare(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }
}

class TokenService {
  static generateTokens(user) {
    const accessToken = generateAccessToken({
      id: user.id,
      student_id: user.student_id,
      name: user.name
    });
    
    const refreshToken = generateRefreshToken();
    const expiryDatetime = getRefreshTokenExpiry();

    return { accessToken, refreshToken, expiryDatetime };
  }
}

export class UserService {
  constructor(userRepository = new UserRepository()) {
    this.userRepository = userRepository;
  }

  async registerUser(userData) {
    const { student_id, password, name, email, class: userClass, grade } = userData;
    
    await this._validateUserNotExists(student_id);
    
    const hashedPassword = await PasswordService.hash(password);
    
    const user = await this.userRepository.createUser({
      student_id: String(student_id),
      password: hashedPassword,
      name,
      email,
      class: userClass,
      grade
    });

    return this._formatUserResponse(user);
  }

  async loginUser({ student_id, password }) {
    const user = await this._validateUserCredentials(student_id, password);
    
    await this.userRepository.deleteRefreshTokensByUserId(user.id);
    
    const { accessToken, refreshToken, expiryDatetime } = TokenService.generateTokens(user);
    
    await this.userRepository.createRefreshToken({
      user_id: user.id,
      refresh_token: refreshToken,
      expiry_datetime: expiryDatetime
    });

    return {
      user: this._formatUserResponse(user),
      accessToken,
      refreshToken
    };
  }

  async refreshAccessToken(refreshToken) {
    const tokenRecord = await this._validateRefreshToken(refreshToken);
    
    await this.userRepository.deleteRefreshTokenById(tokenRecord.id);
    
    const { accessToken, refreshToken: newRefreshToken, expiryDatetime } = TokenService.generateTokens(tokenRecord.user);
    
    await this.userRepository.createRefreshToken({
      user_id: tokenRecord.user.id,
      refresh_token: newRefreshToken,
      expiry_datetime: expiryDatetime
    });

    return {
      accessToken,
      refreshToken: newRefreshToken
    };
  }

  async _validateUserNotExists(studentId) {
    const existing = await this.userRepository.findByStudentId(studentId);
    if (existing) {
      throw new HttpException(400, 'Student ID already exists');
    }
  }

  async _validateUserCredentials(studentId, password) {
    const user = await this.userRepository.findByStudentId(studentId);
    
    if (!user) {
      throw new HttpException(401, 'Invalid credentials');
    }

    const isPasswordValid = await PasswordService.compare(password, user.password);
    if (!isPasswordValid) {
      throw new HttpException(401, 'Invalid credentials');
    }

    return user;
  }

  async _validateRefreshToken(refreshToken) {
    const tokenRecord = await this.userRepository.findValidRefreshToken(refreshToken);
    
    if (!tokenRecord) {
      throw new HttpException(401, 'Invalid or expired refresh token');
    }

    return tokenRecord;
  }

  _formatUserResponse(user) {
    return {
      id: user.id,
      student_id: user.student_id,
      name: user.name,
      email: user.email,
      class: user.class,
      grade: user.grade
    };
  }
}

const userService = new UserService();

export const registerUser = (userData) => userService.registerUser(userData);
export const loginUser = (loginData) => userService.loginUser(loginData);
export const refreshAccessToken = (refreshToken) => userService.refreshAccessToken(refreshToken);
