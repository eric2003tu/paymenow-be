import { Controller, Post, Body, Get, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiHeader } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login a user and get access + refresh tokens' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        expiresIn: '2h',
        user: {
          id: 'user-id-123',
          email: 'john@example.com',
          firstName: 'John',
          lastName: 'Doe',
          role: 'USER',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid email or password' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    schema: {
      example: {
        id: 'user-id-123',
        email: 'john@example.com',
        phone: '+1234567890',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01T00:00:00Z',
        maritalStatus: 'SINGLE',
        nationalId: '123456789',
        trustScore: 50,
        category: 'MODERATE',
      },
    },
  })
  @ApiResponse({ status: 409, description: 'Email or phone already registered' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        refreshToken: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
      required: ['refreshToken'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'New access token generated',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        expiresIn: '2h',
        user: {
          id: 'user-id-123',
          email: 'john@example.com',
          firstName: 'John',
          lastName: 'Doe',
          role: 'USER',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refresh(@Body() body: { refreshToken: string }) {
    return this.authService.refreshToken(body.refreshToken);
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Logout user (invalidate session)' })
  @ApiResponse({ status: 200, description: 'User successfully logged out' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async logout(@Req() req: any) {
    return this.authService.logout(req.user.sub);
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get current user profile with all details' })
  @ApiResponse({
    status: 200,
    description: 'Complete user profile data including address, family, trust score history, loans and offers',
    schema: {
      example: {
        id: 'user-id-123',
        email: 'grace@example.com',
        phone: '+250788456789',
        firstName: 'Grace',
        lastName: 'Mukamana',
        dateOfBirth: '1992-07-22T00:00:00Z',
        maritalStatus: 'DIVORCED',
        nationalId: 'BORROW002',
        nationalIdVerified: true,
        role: 'USER',
        status: 'ACTIVE',
        category: 'TRUSTABLE',
        trustScore: 55,
        totalBorrowed: 150000,
        totalLent: 0,
        totalRepaid: 145000,
        currentDebt: 5000,
        walletBalance: 8000,
        totalLoansTaken: 5,
        totalLoansGiven: 0,
        loansPaidOnTime: 5,
        loansPaidLate: 0,
        loansDefaulted: 0,
        emailVerified: true,
        phoneVerified: true,
        twoFactorEnabled: false,
        address: {
          id: 'addr-123',
          street: 'Kacyiru Road',
          countryId: 'RW',
          latitude: -1.948,
          longitude: 29.875,
        },
        familyDetails: {
          id: 'fam-123',
          fatherName: 'Samuel Mukamana',
          motherName: 'Patricia Mukamana',
          emergencyContactName: 'Samuel Mukamana',
          emergencyContactPhone: '+250788333333',
          emergencyContactRelation: 'Father',
        },
        trustScoreHistory: [
          {
            id: 'tsh-1',
            oldScore: 50,
            newScore: 55,
            change: 5,
            reason: 'LOAN_REPAID_ON_TIME',
            createdAt: '2026-01-06T10:00:00Z',
            loan: {
              id: 'loan-123',
              loanNumber: 'LN-2026-0001',
              amount: 50000,
              status: 'REPAID',
            },
          },
        ],
        loansAsBorrower: [
          {
            id: 'loan-123',
            loanNumber: 'LN-2026-0001',
            amount: 50000,
            totalAmount: 53000,
            amountPaid: 53000,
            amountDue: 0,
            status: 'REPAID',
            isLate: false,
            lateDays: 0,
            dueDate: '2026-01-05T00:00:00Z',
            createdAt: '2025-12-05T00:00:00Z',
          },
        ],
        loansAsLender: [
          {
            id: 'loan-456',
            loanNumber: 'LN-2026-0002',
            amount: 75000,
            totalAmount: 79500,
            amountPaid: 20000,
            amountDue: 59500,
            status: 'ACTIVE',
            isLate: false,
            lateDays: 0,
            dueDate: '2026-02-10T00:00:00Z',
            createdAt: '2025-12-15T00:00:00Z',
            borrower: {
              id: 'user-222',
              firstName: 'Alex',
              lastName: 'Niyonzima',
            },
          },
        ],
        loanRequests: [
          {
            id: 'lr-123',
            loanNumber: 'LR-2026-0001',
            amount: 100000,
            amountFunded: 25000,
            amountNeeded: 75000,
            status: 'OPEN',
            expiresAt: '2026-01-14T00:00:00Z',
            createdAt: '2026-01-07T00:00:00Z',
          },
        ],
        loanOffers: [
          {
            id: 'lo-123',
            amount: 25000,
            interestRate: 6.5,
            status: 'PENDING',
            createdAt: '2026-01-07T00:00:00Z',
            loanRequest: {
              id: 'lr-123',
              loanNumber: 'LR-2026-0001',
              amount: 100000,
              status: 'OPEN',
              borrower: {
                id: 'user-321',
                firstName: 'Bella',
                lastName: 'Uwase',
              },
            },
          },
        ],
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-07T00:00:00Z',
        lastLoginAt: '2026-01-07T06:58:21Z',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@Req() req: any) {
    return this.authService.getProfile(req.user.sub);
  }
}