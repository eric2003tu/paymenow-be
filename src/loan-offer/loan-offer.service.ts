import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateLoanOfferDto } from './dto/create-loan-offer.dto';
import { UpdateLoanOfferDto } from './dto/update-loan-offer.dto';

@Injectable()
export class LoanOfferService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateLoanOfferDto, actingUserId: string) {
    // Force lenderId to the authenticated user
    const { status, ...rest } = dto;
    return this.prisma.loanOffer.create({
      data: {
        ...rest,
        lenderId: actingUserId,
        status: status as any, // Should be LoanOfferStatus enum, cast for now
        interestRate: dto.interestRate ?? 6.0,
      },
    });
  }

  async findAll() {
    return this.prisma.loanOffer.findMany({ where: { isDeleted: false } });
  }

  async findByLender(userId: string) {
    return this.prisma.loanOffer.findMany({
      where: { lenderId: userId, isDeleted: false },
      orderBy: { createdAt: 'desc' },
      include: {
        loanRequest: true,
      },
    });
  }

  async findOne(id: string) {
    const offer = await this.prisma.loanOffer.findUnique({ where: { id } });
    if (!offer || offer.isDeleted) throw new NotFoundException('Loan offer not found');
    return offer;
  }

  async update(id: string, dto: UpdateLoanOfferDto, actingUserId: string) {
    const offer = await this.prisma.loanOffer.findUnique({ where: { id } });
    if (!offer || offer.isDeleted) throw new NotFoundException('Loan offer not found');
    if (offer.lenderId !== actingUserId) throw new ForbiddenException('You can only update your own loan offers');
    const { status, ...rest } = dto;
    return this.prisma.loanOffer.update({
      where: { id },
      data: {
        ...rest,
        ...(status !== undefined ? { status: status as any } : {}),
      },
    });
  }

  async remove(id: string, actingUserId: string) {
    const offer = await this.prisma.loanOffer.findUnique({ where: { id } });
    if (!offer || offer.isDeleted) throw new NotFoundException('Loan offer not found');
    if (offer.lenderId !== actingUserId) throw new ForbiddenException('You can only delete your own loan offers');
    return this.prisma.loanOffer.update({ where: { id }, data: { isDeleted: true } });
  }
}
