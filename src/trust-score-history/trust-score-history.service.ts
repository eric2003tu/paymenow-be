import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { TrustScoreHistory } from '@prisma/client';
import { CreateTrustScoreHistoryDto } from './dto/create-trust-score-history.dto';
import { QueryTrustScoreHistoryDto } from './dto/query-trust-score-history.dto';

@Injectable()
export class TrustScoreHistoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTrustScoreHistoryDto): Promise<TrustScoreHistory> {
    const change = dto.newScore - dto.oldScore;

    return this.prisma.trustScoreHistory.create({
      data: {
        userId: dto.userId,
        loanId: dto.loanId,
        oldScore: dto.oldScore,
        newScore: dto.newScore,
        change,
        reason: dto.reason,
        metadata: dto.metadata || {},
      },
    });
  }

  async findAll(query: QueryTrustScoreHistoryDto): Promise<TrustScoreHistory[]> {
    const where: any = {};

    if (query.userId) {
      where.userId = query.userId;
    }

    if (query.loanId) {
      where.loanId = query.loanId;
    }

    if (query.reason) {
      where.reason = query.reason;
    }

    if (query.startDate || query.endDate) {
      where.createdAt = {};
      if (query.startDate) {
        where.createdAt.gte = new Date(query.startDate);
      }
      if (query.endDate) {
        where.createdAt.lte = new Date(query.endDate);
      }
    }

    return this.prisma.trustScoreHistory.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        loan: {
          select: {
            id: true,
            loanNumber: true,
            amount: true,
            status: true,
          },
        },
      },
    });
  }

  async findOne(id: string): Promise<TrustScoreHistory> {
    const history = await this.prisma.trustScoreHistory.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            trustScore: true,
          },
        },
        loan: {
          select: {
            id: true,
            loanNumber: true,
            amount: true,
            status: true,
          },
        },
      },
    });

    if (!history) {
      throw new NotFoundException(`Trust score history with ID ${id} not found`);
    }

    return history;
  }

  async findByUserId(userId: string): Promise<TrustScoreHistory[]> {
    return this.prisma.trustScoreHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        loan: {
          select: {
            id: true,
            loanNumber: true,
            amount: true,
            status: true,
          },
        },
      },
    });
  }

  async findByLoanId(loanId: string): Promise<TrustScoreHistory[]> {
    return this.prisma.trustScoreHistory.findMany({
      where: { loanId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  async getUserScoreTimeline(userId: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        trustScore: true,
        category: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const history = await this.prisma.trustScoreHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        loan: {
          select: {
            id: true,
            loanNumber: true,
            amount: true,
            status: true,
          },
        },
      },
    });

    return {
      user,
      currentScore: user.trustScore,
      currentCategory: user.category,
      historyCount: history.length,
      history: history.map((h: any) => ({
        id: h.id,
        oldScore: h.oldScore,
        newScore: h.newScore,
        change: h.change,
        reason: h.reason,
        metadata: h.metadata,
        createdAt: h.createdAt,
        loan: h.loan,
      })),
    };
  }
}
