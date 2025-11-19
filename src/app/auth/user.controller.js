import { UserService } from './user.service.js';
import { successResponse } from '../../utils/response.js';
import ValidationException from '../../exception/ValidationException.js';
import ForbiddenException from '../../exception/ForbiddenException.js';

class UserController {
  constructor(userService = new UserService()) {
    this.userService = userService;
    this._bindMethods();
  }

  async register(req, res, next) {
    try {
      const userData = this._validateRegisterData(req.body);
      const adminUser = req.user;
      const user = await this.userService.registerUser(userData, adminUser);
      return successResponse(res, 201, user, 'User registered successfully');
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const loginData = this._validateLoginData(req.body);
      const result = await this.userService.loginUser(loginData);
      return successResponse(res, 200, result, 'Login successful');
    } catch (error) {
      next(error);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = this._validateRefreshData(req.body);
      const result = await this.userService.refreshAccessToken(refreshToken);
      return successResponse(res, 200, result, 'Token refreshed successfully');
    } catch (error) {
      next(error);
    }
  }

  _bindMethods() {
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.refresh = this.refresh.bind(this);
  }

  _validateRegisterData(body) {
    const { student_id, password, name, email, class: userClass, grade, role } = body;
    
    if (!student_id || !password) {
      throw new ValidationException('Student ID and password are required');
    }
    if (!name || !email || userClass == null || grade == null) {
      throw new ValidationException('Name, email, class, and grade are required');
    }

    return { student_id, password, name, email, class: userClass, grade, role };
  }

  _validateLoginData(body) {
    const { student_id, password } = body;
    
    if (!student_id || !password) {
      throw new ValidationException('Student ID and password are required');
    }

    return { student_id, password };
  }

  _validateRefreshData(body) {
    const { refreshToken } = body;
    
    if (!refreshToken) {
      throw new ValidationException('Refresh token is required');
    }

    return { refreshToken };
  }
}

const userController = new UserController();

export const register = userController.register;
export const login = userController.login;
export const refresh = userController.refresh;
