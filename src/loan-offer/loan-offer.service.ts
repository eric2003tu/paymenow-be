import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { NotificationService } from '../notification/notification.service';
import { CreateLoanOfferDto } from './dto/create-loan-offer.dto';
import { UpdateLoanOfferDto } from './dto/update-loan-offer.dto';

@Injectable()
export class LoanOfferService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  private borrowerSelect = {
    id: true,
    firstName: true,
    lastName: true,
    email: true,
    phone: true,
    dateOfBirth: true,
    maritalStatus: true,
    nationalId: true,
    profilePicture: true,
    trustScore: true,
    category: true,
    address: {
      select: {
        street: true,
        latitude: true,
        longitude: true,
        country: { select: { id: true, name: true, code: true } },
        province: { select: { id: true, name: true } },
        district: { select: { id: true, name: true } },
        sector: { select: { id: true, name: true } },
        cell: { select: { id: true, name: true } },
        village: { select: { id: true, name: true } },
      },
    },
    familyDetails: {
      select: {
        spouseName: true,
        spouseNationalId: true,
        spousePhone: true,
        fatherName: true,
        motherName: true,
        emergencyContactName: true,
        emergencyContactPhone: true,
        emergencyContactRelation: true,
      },
    },
  };

  async create(dto: CreateLoanOfferDto, actingUserId: string) {
    // Check if user is verified (status = 'ACTIVE')
    const user = await this.prisma.user.findUnique({
      where: { id: actingUserId },
      select: { status: true },
    });
    if (!user || user.status !== 'ACTIVE') {
      throw new BadRequestException('Your account must be verified by admin before you can make loan offers.');
    }

    // Prevent duplicate offers for the same loanRequestId and lenderId
    const existingOffer = await this.prisma.loanOffer.findFirst({
      where: {
        loanRequestId: dto.loanRequestId,
        lenderId: actingUserId,
        isDeleted: false,
      },
    });
    if (existingOffer) {
      throw new BadRequestException('You have already made an offer for this loan request.');
    }

    const { status, ...rest } = dto;
    const offer = await this.prisma.loanOffer.create({
      data: {
        ...rest,
        lenderId: actingUserId,
        status: status as any, // Should be LoanOfferStatus enum, cast for now
        interestRate: dto.interestRate ?? 6.0,
      },
      include: { loanRequest: true },
    });

    // Notify borrower of the new offer
    const lender = await this.prisma.user.findUnique({
      where: { id: actingUserId },
      select: { firstName: true, lastName: true },
    });
    const borrower = await this.prisma.user.findUnique({
      where: { id: offer.loanRequest.borrowerId },
      select: { firstName: true, lastName: true },
    });

    if (lender && borrower) {
      const lenderName = `${lender.firstName} ${lender.lastName}`;
      await this.notificationService.notifyBorrowerOfOfferCreated(
        offer.loanRequest.borrowerId,
        lenderName,
        Number(offer.amount),
      );
    }

    return offer;
  }

  async findAll() {
    return this.prisma.loanOffer.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: 'desc' },
      include: {
        loanRequest: {
          include: {
            borrower: { select: this.borrowerSelect },
          },
        },
      },
    });
  }

  async findByLender(userId: string) {
    return this.prisma.loanOffer.findMany({
      where: { lenderId: userId, isDeleted: false },
      orderBy: { createdAt: 'desc' },
      include: {
        loanRequest: {
          include: {
            borrower: { select: this.borrowerSelect },
          },
        },
      },
    });
  }

  async findByLenderWithDetails(userId: string) {
    return this.prisma.loanOffer.findMany({
      where: { lenderId: userId, isDeleted: false },
      orderBy: { createdAt: 'desc' },
      include: {
        loanRequest: {
          include: {
            borrower: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                dateOfBirth: true,
                maritalStatus: true,
                nationalId: true,
                profilePicture: true,
                trustScore: true,
                category: true,
                address: {
                  select: {
                    street: true,
                    latitude: true,
                    longitude: true,
                    country: {
                      select: {
                        id: true,
                        name: true,
                        code: true,
                      },
                    },
                    province: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                    district: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                    sector: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                    cell: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                    village: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                  },
                },
                familyDetails: {
                  select: {
                    spouseName: true,
                    spouseNationalId: true,
                    spousePhone: true,
                    fatherName: true,
                    motherName: true,
                    emergencyContactName: true,
                    emergencyContactPhone: true,
                    emergencyContactRelation: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async findOffersOnBorrowerRequests(userId: string) {
    return this.prisma.loanOffer.findMany({
      where: {
        isDeleted: false,
        loanRequest: { borrowerId: userId },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        loanRequest: {
          include: {
            borrower: { select: this.borrowerSelect },
          },
        },
        lender: {
          select: this.borrowerSelect, // reuse same select for lender profile details
        },
      },
    });
  }

  async findOne(id: string) {
    const offer = await this.prisma.loanOffer.findUnique({
      where: { id },
      include: {
        loanRequest: {
          include: {
            borrower: { select: this.borrowerSelect },
          },
        },
      },
    });
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
