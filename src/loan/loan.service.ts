import { Injectable, BadRequestException } from '@nestjs/common';
import type { Prisma, Loan } from '@prisma/client';
import { PrismaService } from '../prisma.service';  // Add this import
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';

@Injectable()
export class LoanService {
  constructor(private readonly prisma: PrismaService) {}

  async createLoan(dto: CreateLoanDto): Promise<Loan | any> {
    try {
      // Filter out undefined for required fields and cast status to enum
      const {
        status,
        totalAmount,
        amountDue,
        ...rest
      } = dto;
      return await this.prisma.loan.create({
        data: {
          ...rest,
          totalAmount: totalAmount ?? 0,
          amountDue: amountDue ?? 0,
          status: status as any, // Should be LoanStatus enum
        },
      });
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async findAll(): Promise<Loan[] | any[]> {
    return this.prisma.loan.findMany({ where: { isDeleted: false } });
  }

  async findOne(id: string): Promise<Loan | any | null> {
    return this.prisma.loan.findUnique({ where: { id } });
  }

  async updateLoan(id: string, dto: UpdateLoanDto): Promise<Loan | any> {
    // Filter out undefined for required fields and cast status to enum
    const {
      status,
      totalAmount,
      amountDue,
      ...rest
    } = dto;
    return this.prisma.loan.update({
      where: { id },
      data: {
        ...rest,
        ...(totalAmount !== undefined ? { totalAmount } : {}),
        ...(amountDue !== undefined ? { amountDue } : {}),
        ...(status !== undefined ? { status: status as any } : {}),
      },
    });
  }

  async softDeleteLoan(id: string): Promise<Loan | any> {
    return this.prisma.loan.update({ where: { id }, data: { isDeleted: true, deletedAt: new Date() } });
  }
}
