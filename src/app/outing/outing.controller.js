import { OutingService } from './outing.service.js';
import { successResponse } from '../../utils/response.js';
import ValidationException from '../../exception/ValidationException.js';

class OutingController {
  constructor(outingService = new OutingService()) {
    this.outingService = outingService;
    this._bindMethods();
  }

  async createOutingRequest(req, res, next) {
    try {
      const outingData = this._validateOutingData(req.body);
      const userId = req.user.id;
      const request = await this.outingService.createOutingRequest(userId, outingData);
      return successResponse(res, 201, request, 'Outing request created successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateOutingRequest(req, res, next) {
    try {
      const requestId = parseInt(req.params.id);
      const outingData = this._validateUpdateData(req.body);
      const userId = req.user.id;
      const request = await this.outingService.updateOutingRequest(userId, requestId, outingData);
      return successResponse(res, 200, request, 'Outing request updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAllOutingRequests(req, res, next) {
    try {
      const userRole = req.user.role;
      const userId = req.user.id;
      
      let requests;
      if (userRole === 'ADMIN') {
        requests = await this.outingService.getAllOutingRequests();
      } else {
        requests = await this.outingService.getUserOutingRequests(userId);
      }
      
      return successResponse(res, 200, requests, 'Outing requests retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateOutingStatus(req, res, next) {
    try {
      const requestId = parseInt(req.params.id);
      const { status } = this._validateStatusData(req.body);
      const request = await this.outingService.updateOutingStatus(requestId, status);
      return successResponse(res, 200, request, 'Outing status updated successfully');
    } catch (error) {
      next(error);
    }
  }

  _bindMethods() {
    this.createOutingRequest = this.createOutingRequest.bind(this);
    this.updateOutingRequest = this.updateOutingRequest.bind(this);
    this.getAllOutingRequests = this.getAllOutingRequests.bind(this);
    this.updateOutingStatus = this.updateOutingStatus.bind(this);
  }

  _validateOutingData(body) {
    const { start_time, end_time, reason } = body;
    
    if (!start_time || !end_time || !reason) {
      throw new ValidationException('Start time, end time, and reason are required');
    }

    return { start_time, end_time, reason };
  }

  _validateUpdateData(body) {
    const { start_time, end_time, reason } = body;
    
    if (!start_time && !end_time && !reason) {
      throw new ValidationException('At least one field must be provided for update');
    }

    return { start_time, end_time, reason };
  }

  _validateStatusData(body) {
    const { status } = body;
    
    if (!status || !['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
      throw new ValidationException('Valid status is required (PENDING, APPROVED, REJECTED)');
    }

    return { status };
  }
}

const outingController = new OutingController();

export const createOutingRequest = outingController.createOutingRequest;
export const updateOutingRequest = outingController.updateOutingRequest;
export const getAllOutingRequests = outingController.getAllOutingRequests;
export const updateOutingStatus = outingController.updateOutingStatus;