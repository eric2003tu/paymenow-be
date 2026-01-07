import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateLoanOfferDto } from './dto/create-loan-offer.dto';
import { UpdateLoanOfferDto } from './dto/update-loan-offer.dto';

@Injectable()
export class LoanOfferService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateLoanOfferDto) {
    // Map status to enum if present
    const { status, ...rest } = dto;
    return this.prisma.loanOffer.create({
      data: {
        ...rest,
        status: status as any, // Should be LoanOfferStatus enum, cast for now
        interestRate: dto.interestRate ?? 6.0,
      },
    });
  }

  async findAll() {
    return this.prisma.loanOffer.findMany({ where: { isDeleted: false } });
  }

  async findOne(id: string) {
    const offer = await this.prisma.loanOffer.findUnique({ where: { id } });
    if (!offer || offer.isDeleted) throw new NotFoundException('Loan offer not found');
    return offer;
  }

  async update(id: string, dto: UpdateLoanOfferDto, isAdmin = false) {
    const offer = await this.prisma.loanOffer.findUnique({ where: { id } });
    if (!offer || offer.isDeleted) throw new NotFoundException('Loan offer not found');
    if (!isAdmin) throw new ForbiddenException('Only admin can update loan offers');
    // Map status to enum if present
    const { status, ...rest } = dto;
    return this.prisma.loanOffer.update({
      where: { id },
      data: {
        ...rest,
        ...(status !== undefined ? { status: status as any } : {}),
      },
    });
  }

  async remove(id: string, isAdmin = false) {
    const offer = await this.prisma.loanOffer.findUnique({ where: { id } });
    if (!offer || offer.isDeleted) throw new NotFoundException('Loan offer not found');
    if (!isAdmin) throw new ForbiddenException('Only admin can delete loan offers');
    return this.prisma.loanOffer.update({ where: { id }, data: { isDeleted: true } });
  }
}
