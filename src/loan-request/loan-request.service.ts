import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';  // Add this import
import type { Prisma, LoanRequest } from '@prisma/client';
import { CreateLoanRequestDto } from './dto/create-loan-request.dto';
import { UpdateLoanRequestDto } from './dto/update-loan-request.dto';

@Injectable()
export class LoanRequestService {
  constructor(private readonly prisma: PrismaService) {}

  async createLoanRequest(dto: CreateLoanRequestDto): Promise<LoanRequest | any> {
    try {
      return await this.prisma.loanRequest.create({
        data: {
          borrowerId: dto.borrowerId,
          amount: dto.amount,
          minAmount: dto.minAmount,
          interestRate: typeof dto.interestRate === 'number' ? dto.interestRate : 6.0,
          durationDays: dto.durationDays,
          purpose: dto.purpose,
          amountFunded: dto.amountFunded,
          amountNeeded: dto.amountNeeded ?? 0,
          status: dto.status as any, // Should be LoanRequestStatus enum
          fundingDeadline: dto.fundingDeadline ? new Date(dto.fundingDeadline) : undefined,
          isPublic: dto.isPublic,
          maxLenders: dto.maxLenders,
          expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
        },
      });
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async findAll(): Promise<LoanRequest[] | any[]> {
    return this.prisma.loanRequest.findMany({ where: { isDeleted: false } });
  }

  async findOne(id: string): Promise<LoanRequest | any | null> {
    return this.prisma.loanRequest.findUnique({ where: { id } });
  }

  async updateLoanRequest(id: string, dto: UpdateLoanRequestDto): Promise<LoanRequest | any> {
    const { status, amountNeeded, ...rest } = dto;
    return this.prisma.loanRequest.update({
      where: { id },
      data: {
        ...rest,
        ...(amountNeeded !== undefined ? { amountNeeded } : {}),
        ...(status !== undefined ? { status: status as any } : {}),
      },
    });
  }

  async softDeleteLoanRequest(id: string): Promise<LoanRequest | any> {
    return this.prisma.loanRequest.update({ where: { id }, data: { isDeleted: true } });
  }
}
