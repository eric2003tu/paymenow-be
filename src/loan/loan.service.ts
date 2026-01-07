import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import type { Prisma, Loan, LoanStatus, UserCategory, DocumentType } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { TrustScoreHistoryService } from '../trust-score-history/trust-score-history.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';

@Injectable()
export class LoanService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly trustScoreHistoryService: TrustScoreHistoryService,
  ) {}

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

  /**
   * Accept a loan offer: borrower confirms and a loan is created from the selected offer + request
   */
  async createFromOffer(offerId: string, actingBorrowerId: string, documents: Array<{ documentType: string; documentUrl: string }>): Promise<Loan> {
    return this.prisma.$transaction(async (tx) => {
      const toNumber = (v: any) => (v && typeof v === 'object' && typeof v.toNumber === 'function' ? v.toNumber() : Number(v));

      const offer = await tx.loanOffer.findUnique({
        where: { id: offerId },
        include: { loanRequest: true },
      });

      if (!offer || offer.isDeleted) {
        throw new NotFoundException('Loan offer not found');
      }

      if (offer.status !== 'PENDING') {
        throw new BadRequestException('Only pending offers can be accepted');
      }

      const request = offer.loanRequest;
      if (!request || request.isDeleted) {
        throw new NotFoundException('Related loan request not found');
      }

      if (request.borrowerId !== actingBorrowerId) {
        throw new ForbiddenException('You can only accept offers for your own loan requests');
      }

      if (['FUNDED', 'CANCELLED', 'EXPIRED'].includes(request.status)) {
        throw new BadRequestException('This loan request is no longer open for funding');
      }

      const amount: number = toNumber(offer.amount);
      const interestRate: number = toNumber(offer.interestRate ?? request.interestRate ?? 6.0);
      const durationDays = request.durationDays;
      const purpose = request.purpose;

      const totalAmount: number = amount + amount * (interestRate / 100);

      const loan = await tx.loan.create({
        data: {
          borrowerId: request.borrowerId,
          lenderId: offer.lenderId,
          amount,
          interestRate,
          durationDays,
          purpose,
          disbursedAt: null,
          dueDate: null,
          repaidAt: null,
          totalAmount,
          amountPaid: 0,
          amountDue: totalAmount,
          status: 'PENDING',
          isLate: false,
          lateDays: 0,
          penaltyAmount: 0,
          agreementUrl: null,
          signedByBorrower: true,
          signedByLender: false,
        },
      });

      // Update offer status to ACCEPTED
      await tx.loanOffer.update({
        where: { id: offer.id },
        data: { status: 'ACCEPTED' },
      });

      // Update request funding tallies and status
      const newAmountFunded: number = toNumber(request.amountFunded ?? 0) + amount;
      const amountNeeded: number = Math.max(0, toNumber(request.amount) - newAmountFunded);
      await tx.loanRequest.update({
        where: { id: request.id },
        data: {
          amountFunded: newAmountFunded,
          amountNeeded,
          status: amountNeeded <= 0 ? 'FUNDED' : 'PARTIAL',
        },
      });

      if (documents && documents.length > 0) {
        await tx.verificationDocument.createMany({
          data: documents.map((doc) => ({
            userId: actingBorrowerId,
            documentType: doc.documentType as any,
            documentUrl: doc.documentUrl,
            status: 'PENDING',
          })),
        });
      }

      return loan;
    });
  }

  async findAll(): Promise<Loan[] | any[]> {
    return this.prisma.loan.findMany({ where: { isDeleted: false } });
  }

  async findByBorrower(userId: string): Promise<Loan[] | any[]> {
    return this.prisma.loan.findMany({
      where: { borrowerId: userId, isDeleted: false },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByLender(userId: string): Promise<Loan[] | any[]> {
    return this.prisma.loan.findMany({
      where: { lenderId: userId, isDeleted: false },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Lender signs the loan, activating it and setting disbursement/due dates
   */
  async signLoanByLender(loanId: string, actingLenderId: string): Promise<Loan> {
    const loan = await this.prisma.loan.findUnique({ where: { id: loanId } });

    if (!loan || loan.isDeleted) {
      throw new NotFoundException('Loan not found');
    }

    if (loan.lenderId !== actingLenderId) {
      throw new ForbiddenException('You can only sign loans where you are the lender');
    }

    if (loan.status !== 'PENDING') {
      throw new BadRequestException('Only pending loans can be signed');
    }

    if (!loan.signedByBorrower) {
      throw new BadRequestException('Borrower must sign first');
    }

    if (loan.signedByLender) {
      throw new BadRequestException('Loan is already signed by lender');
    }

    const now = new Date();
    const dueDate = new Date(now);
    dueDate.setDate(dueDate.getDate() + loan.durationDays);

    return this.prisma.loan.update({
      where: { id: loanId },
      data: {
        signedByLender: true,
        status: 'ACTIVE',
        disbursedAt: now,
        dueDate,
      },
    });
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

  // ==================== TRUST SCORE MANAGEMENT ====================

  /**
   * Calculate trust score change based on loan performance
   */
  private calculateScoreChange(status: LoanStatus, lateDays: number): number {
    switch (status) {
      case 'REPAID':
        if (lateDays === 0) return 10; // On-time repayment
        if (lateDays <= 3) return 5;   // Slightly late
        if (lateDays <= 7) return 2;   // Moderately late
        return -5;                      // Very late but still paid
      
      case 'DEFAULTED':
        return -20; // Severe penalty for default
      
      case 'OVERDUE':
        if (lateDays <= 7) return -3;
        if (lateDays <= 15) return -5;
        return -10; // Very overdue
      
      case 'CANCELLED':
        return -2; // Small penalty
      
      default:
        return 0;
    }
  }

  /**
   * Determine user category based on trust score
   */
  private determineCategory(score: number): UserCategory {
    if (score >= 85) return 'EXCELLENT';
    if (score >= 70) return 'GOOD';
    if (score >= 55) return 'TRUSTABLE';
    if (score >= 40) return 'MODERATE';
    if (score >= 25) return 'RISKY';
    return 'DEFAULT';
  }

  /**
   * Update user trust score and create history entry
   */
  async updateUserTrustScore(
    userId: string,
    loanId: string,
    status: LoanStatus,
    lateDays: number,
    metadata?: any,
  ): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { trustScore: true, id: true },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const oldScore = user.trustScore;
    const scoreChange = this.calculateScoreChange(status as LoanStatus, lateDays);
    let newScore = oldScore + scoreChange;

    // Ensure score stays within 0-100 range
    newScore = Math.max(0, Math.min(100, newScore));

    // Determine new category
    const newCategory = this.determineCategory(newScore);

    // Update user in transaction
    await this.prisma.$transaction(async (tx) => {
      // Update user score and category
      await tx.user.update({
        where: { id: userId },
        data: {
          trustScore: newScore,
          category: newCategory,
        },
      });

      // Create history entry
      await tx.trustScoreHistory.create({
        data: {
          userId,
          loanId,
          oldScore,
          newScore,
          change: scoreChange,
          reason: this.getReasonFromStatus(status as LoanStatus, lateDays),
          metadata: {
            ...metadata,
            lateDays,
            status,
            calculatedChange: scoreChange,
          },
        },
      });
    });
  }

  /**
   * Get human-readable reason for score change
   */
  private getReasonFromStatus(status: LoanStatus, lateDays: number): string {
    switch (status) {
      case 'REPAID':
        if (lateDays === 0) return 'LOAN_REPAID_ON_TIME';
        if (lateDays <= 3) return 'LOAN_REPAID_SLIGHTLY_LATE';
        if (lateDays <= 7) return 'LOAN_REPAID_MODERATELY_LATE';
        return 'LOAN_REPAID_VERY_LATE';
      
      case 'DEFAULTED':
        return 'LOAN_DEFAULTED';
      
      case 'OVERDUE':
        return 'LOAN_OVERDUE';
      
      case 'CANCELLED':
        return 'LOAN_CANCELLED';
      
      default:
        return 'LOAN_STATUS_CHANGED';
    }
  }

  /**
   * Mark loan as repaid and update trust score
   */
  async markLoanAsRepaid(id: string): Promise<Loan> {
    const loan = await this.prisma.loan.findUnique({
      where: { id },
    });

    if (!loan) {
      throw new NotFoundException(`Loan with ID ${id} not found`);
    }

    const now = new Date();
    const lateDays = loan.dueDate 
      ? Math.max(0, Math.floor((now.getTime() - loan.dueDate.getTime()) / (1000 * 60 * 60 * 24)))
      : 0;

    const updatedLoan = await this.prisma.loan.update({
      where: { id },
      data: {
        status: 'REPAID',
        repaidAt: now,
        amountPaid: loan.totalAmount,
        amountDue: 0,
        isLate: lateDays > 0,
        lateDays,
      },
    });

    // Update borrower's trust score
    await this.updateUserTrustScore(
      loan.borrowerId,
      id,
      'REPAID',
      lateDays,
      {
        amount: loan.amount.toString(),
        totalAmount: loan.totalAmount.toString(),
        repaidAt: now,
      },
    );

    return updatedLoan;
  }

  /**
   * Mark loan as defaulted and update trust score
   */
  async markLoanAsDefaulted(id: string): Promise<Loan> {
    const loan = await this.prisma.loan.findUnique({
      where: { id },
    });

    if (!loan) {
      throw new NotFoundException(`Loan with ID ${id} not found`);
    }

    const now = new Date();
    const lateDays = loan.dueDate 
      ? Math.max(0, Math.floor((now.getTime() - loan.dueDate.getTime()) / (1000 * 60 * 60 * 24)))
      : 0;

    const updatedLoan = await this.prisma.loan.update({
      where: { id },
      data: {
        status: 'DEFAULTED',
        isLate: true,
        lateDays,
      },
    });

    // Update borrower's trust score
    await this.updateUserTrustScore(
      loan.borrowerId,
      id,
      'DEFAULTED',
      lateDays,
      {
        amount: loan.amount.toString(),
        totalAmount: loan.totalAmount.toString(),
        amountDue: loan.amountDue.toString(),
      },
    );

    return updatedLoan;
  }

  /**
   * Update loan status with automatic trust score tracking
   */
  async updateLoanStatus(id: string, status: LoanStatus): Promise<Loan> {
    const loan = await this.prisma.loan.findUnique({
      where: { id },
    });

    if (!loan) {
      throw new NotFoundException(`Loan with ID ${id} not found`);
    }

    const now = new Date();
    const lateDays = loan.dueDate 
      ? Math.max(0, Math.floor((now.getTime() - loan.dueDate.getTime()) / (1000 * 60 * 60 * 24)))
      : 0;

    const updatedLoan = await this.prisma.loan.update({
      where: { id },
      data: {
        status,
        ...(status === 'REPAID' && {
          repaidAt: now,
          amountPaid: loan.totalAmount,
          amountDue: 0,
        }),
        ...(lateDays > 0 && {
          isLate: true,
          lateDays,
        }),
      },
    });

    // Only update trust score for status changes that matter
    if (['REPAID', 'DEFAULTED', 'OVERDUE', 'CANCELLED'].includes(status)) {
      await this.updateUserTrustScore(
        loan.borrowerId,
        id,
        status,
        lateDays,
        {
          amount: loan.amount.toString(),
          previousStatus: loan.status,
        },
      );
    }

    return updatedLoan;
  }
}
