import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import type { Prisma, User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(dto: CreateUserDto): Promise<User | any> {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            email: dto.email,
            phone: dto.phone,
            password: dto.password,
            firstName: dto.firstName,
            lastName: dto.lastName,
            dateOfBirth: new Date(dto.dateOfBirth),
            maritalStatus: dto.maritalStatus as any,
            nationalId: dto.nationalId,
            address: {
              create: {
                ...dto.address,
              },
            },
            familyDetails: dto.familyDetails
              ? {
                  create: {
                    ...dto.familyDetails,
                  },
                }
              : undefined,
          },
        });

        return user;
      });
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany({
      where: { isDeleted: false },
      include: {
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
        familyDetails: true,
        verificationDocuments: true,
        trustScoreHistory: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        loansAsBorrower: {
          orderBy: { createdAt: 'desc' },
          take: 3,
          select: {
            id: true,
            loanNumber: true,
            amount: true,
            totalAmount: true,
            status: true,
            dueDate: true,
            createdAt: true,
          },
        },
        loansAsLender: {
          orderBy: { createdAt: 'desc' },
          take: 3,
          select: {
            id: true,
            loanNumber: true,
            amount: true,
            totalAmount: true,
            status: true,
            dueDate: true,
            createdAt: true,
          },
        },
        loanRequests: {
          orderBy: { createdAt: 'desc' },
          take: 3,
          select: {
            id: true,
            amount: true,
            interestRate: true,
            durationDays: true,
            status: true,
            createdAt: true,
          },
        },
      },
    });
  }

  async findOne(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
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
        familyDetails: true,
        verificationDocuments: true,
        trustScoreHistory: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        loansAsBorrower: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: {
            id: true,
            loanNumber: true,
            amount: true,
            totalAmount: true,
            status: true,
            dueDate: true,
            createdAt: true,
            lender: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                trustScore: true,
                category: true,
              },
            },
          },
        },
        loansAsLender: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: {
            id: true,
            loanNumber: true,
            amount: true,
            totalAmount: true,
            status: true,
            dueDate: true,
            createdAt: true,
            borrower: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                trustScore: true,
                category: true,
              },
            },
          },
        },
        loanRequests: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: {
            id: true,
            amount: true,
            interestRate: true,
            durationDays: true,
            status: true,
            createdAt: true,
          },
        },
      },
    });
  }

  async updateUser(id: string, dto: UpdateUserDto): Promise<User> {
    const { maritalStatus, ...rest } = dto;
    return this.prisma.user.update({
      where: { id },
      data: {
        ...rest,
        ...(maritalStatus !== undefined ? { maritalStatus: maritalStatus as any } : {}),
      },
    });
  }

  async softDeleteUser(id: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { isDeleted: true, deletedAt: new Date() },
    });
  }
}