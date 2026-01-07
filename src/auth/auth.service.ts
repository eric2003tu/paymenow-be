import { Injectable, ConflictException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Login user and return access + refresh tokens
   */
  async login(dto: { email: string; password: string }) {
    const user = await this.validateUser(dto.email, dto.password);
    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }

    const tokens = this.generateTokens(user);

    // Update last login time
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return tokens;
  }

  /**
   * Register new user
   */
  async register(dto: any) {
    // Check if email already exists
    const existingEmail = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingEmail) {
      throw new ConflictException('Email already registered');
    }

    // Check if phone already exists
    const existingPhone = await this.prisma.user.findUnique({
      where: { phone: dto.phone },
    });

    if (existingPhone) {
      throw new ConflictException('Phone number already registered');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Create user in database
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        phone: dto.phone,
        password: hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
        dateOfBirth: new Date(dto.dateOfBirth),
        maritalStatus: dto.maritalStatus,
        nationalId: dto.nationalId,
        address: dto.address
          ? {
              create: dto.address,
            }
          : undefined,
        familyDetails: dto.familyDetails
          ? {
              create: dto.familyDetails,
            }
          : undefined,
        verificationDocuments: dto.verificationDocuments?.length
          ? {
              create: dto.verificationDocuments.map((doc: any) => ({
                documentType: doc.documentType,
                documentUrl: doc.documentUrl,
                status: 'PENDING',
              })),
            }
          : undefined,
      },
    });

    // Remove password from response
    const { password, ...result } = user;
    return result;
  }

  /**
   * Validate user credentials against database
   */
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  /**
   * Generate access and refresh tokens
   */
  private generateTokens(user: User) {
    const jwtSecret = this.configService.get('JWT_SECRET') || 'your-super-secret-jwt-key-change-this-in-production';

    const accessToken = this.jwtService.sign(
      { sub: user.id, email: user.email, role: user.role },
      { secret: jwtSecret, expiresIn: '15m' },
    );

    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      { secret: jwtSecret, expiresIn: '7d' },
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: 900, // 15 minutes in seconds
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(refreshToken: string) {
    try {
      const jwtSecret = this.configService.get('JWT_SECRET') || 'your-super-secret-jwt-key-change-this-in-production';
      const payload = this.jwtService.verify(refreshToken, { secret: jwtSecret });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return this.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * Logout user
   */
  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { lastLoginAt: new Date() },
    });

    return { message: 'Logged out successfully' };
  }

  /**
   * Get complete user profile with all related information
   */
  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        address: true,
        familyDetails: true,
        trustScoreHistory: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: {
            id: true,
            oldScore: true,
            newScore: true,
            change: true,
            reason: true,
            metadata: true,
            createdAt: true,
            loan: {
              select: {
                id: true,
                loanNumber: true,
                amount: true,
                status: true,
              },
            },
          },
        },
        loansAsBorrower: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: {
            id: true,
            loanNumber: true,
            amount: true,
            totalAmount: true,
            amountPaid: true,
            amountDue: true,
            status: true,
            isLate: true,
            lateDays: true,
            dueDate: true,
            createdAt: true,
            lender: {
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
        loansAsLender: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: {
            id: true,
            loanNumber: true,
            amount: true,
            totalAmount: true,
            amountPaid: true,
            amountDue: true,
            status: true,
            isLate: true,
            lateDays: true,
            dueDate: true,
            createdAt: true,
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
        loanRequests: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: {
            id: true,
            loanNumber: true,
            amount: true,
            amountFunded: true,
            amountNeeded: true,
            status: true,
            expiresAt: true,
            createdAt: true,
            loanOffers: {
              orderBy: { createdAt: 'desc' },
              select: {
                id: true,
                amount: true,
                interestRate: true,
                status: true,
                createdAt: true,
                lender: {
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
        },
        loanOffers: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: {
            id: true,
            amount: true,
            interestRate: true,
            status: true,
            createdAt: true,
            loanRequest: {
              select: {
                id: true,
                loanNumber: true,
                amount: true,
                status: true,
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
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Normalize Decimal values to numbers for a clean JSON response
    const toNumber = (value: any) =>
      value && typeof value === 'object' && typeof value.toNumber === 'function'
        ? value.toNumber()
        : value;

    const mapLoan = (loan: any) => ({
      ...loan,
      amount: toNumber(loan.amount),
      totalAmount: toNumber(loan.totalAmount),
      amountPaid: toNumber(loan.amountPaid),
      amountDue: toNumber(loan.amountDue),
    });

    const mapLoanRequest = (lr: any) => ({
      ...lr,
      amount: toNumber(lr.amount),
      amountFunded: toNumber(lr.amountFunded),
      amountNeeded: toNumber(lr.amountNeeded),
      loanOffers: lr.loanOffers?.map((lo: any) => ({
        ...lo,
        amount: toNumber(lo.amount),
      })),
    });

    const { password, ...userWithoutPassword } = user;

    return {
      ...userWithoutPassword,
      totalBorrowed: toNumber(userWithoutPassword.totalBorrowed),
      totalLent: toNumber(userWithoutPassword.totalLent),
      totalRepaid: toNumber(userWithoutPassword.totalRepaid),
      currentDebt: toNumber(userWithoutPassword.currentDebt),
      walletBalance: toNumber(userWithoutPassword.walletBalance),
      loansAsBorrower: userWithoutPassword.loansAsBorrower?.map(mapLoan),
      loansAsLender: userWithoutPassword.loansAsLender?.map(mapLoan),
      loanRequests: userWithoutPassword.loanRequests?.map(mapLoanRequest),
      loanOffers: userWithoutPassword.loanOffers?.map((lo: any) => ({
        ...lo,
        amount: toNumber(lo.amount),
        loanRequest: lo.loanRequest
          ? {
              ...lo.loanRequest,
              amount: toNumber(lo.loanRequest.amount),
            }
          : undefined,
      })),
      trustScoreHistory: userWithoutPassword.trustScoreHistory?.map((h: any) => ({
        ...h,
        loan: h.loan
          ? {
              ...h.loan,
              amount: toNumber(h.loan.amount),
            }
          : undefined,
      })),
    };
  }
}