import { PrismaClient } from '@prisma/client';
import ValidationException from '../../exception/ValidationException.js';
import HttpException from '../../exception/HttpException.js';

export class OutingService {
  constructor(prisma = new PrismaClient()) {
    this.prisma = prisma;
  }

  async createOutingRequest(userId, outingData) {
    const { start_time, end_time, reason } = outingData;

    if (new Date(start_time) >= new Date(end_time)) {
      throw new ValidationException('Start time must be before end time');
    }

    return await this.prisma.outing_request.create({
      data: {
        user_id: userId,
        start_time: new Date(start_time),
        end_time: new Date(end_time),
        reason
      }
    });
  }

  async updateOutingRequest(userId, requestId, outingData) {
    const existingRequest = await this.prisma.outing_request.findFirst({
      where: { id: requestId, user_id: userId }
    });

    if (!existingRequest) {
      throw new HttpException(404, 'Outing request not found');
    }

    const { start_time, end_time, reason } = outingData;

    if (start_time && end_time && new Date(start_time) >= new Date(end_time)) {
      throw new ValidationException('Start time must be before end time');
    }

    return await this.prisma.outing_request.update({
      where: { id: requestId },
      data: {
        ...(start_time && { start_time: new Date(start_time) }),
        ...(end_time && { end_time: new Date(end_time) }),
        ...(reason && { reason })
      }
    });
  }
}