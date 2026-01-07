import { ApiProperty } from '@nestjs/swagger';

export class FullUserResponseDto {
  @ApiProperty({ example: 'user-id-123' })
  id: string;
  @ApiProperty({ example: 'user@email.com' })
  email: string;
  @ApiProperty({ example: '+250788123456' })
  phone: string;
  @ApiProperty({ example: 'USER' })
  role: string;
  @ApiProperty({ example: 'ACTIVE' })
  status: string;
  @ApiProperty({ example: 'MODERATE' })
  category: string;
  @ApiProperty({ example: 50 })
  trustScore: number;
  @ApiProperty({ example: 'John' })
  firstName: string;
  @ApiProperty({ example: 'Doe' })
  lastName: string;
  @ApiProperty({ example: '1990-01-01' })
  dateOfBirth: Date;
  @ApiProperty({ example: 'SINGLE' })
  maritalStatus: string;
  @ApiProperty({ example: '1234567890123456' })
  nationalId: string;
  @ApiProperty({ example: true })
  nationalIdVerified: boolean;
  @ApiProperty({ example: 'https://example.com/profile.jpg', required: false })
  profilePicture?: string;
  @ApiProperty({ example: true })
  emailVerified: boolean;
  @ApiProperty({ example: false })
  phoneVerified: boolean;
  @ApiProperty({ example: false })
  twoFactorEnabled: boolean;
  @ApiProperty({ example: '0.00' })
  totalBorrowed: string;
  @ApiProperty({ example: '0.00' })
  totalLent: string;
  @ApiProperty({ example: '0.00' })
  totalRepaid: string;
  @ApiProperty({ example: '0.00' })
  currentDebt: string;
  @ApiProperty({ example: '0.00' })
  walletBalance: string;
  @ApiProperty({ example: 0 })
  totalLoansTaken: number;
  @ApiProperty({ example: 0 })
  totalLoansGiven: number;
  @ApiProperty({ example: 0 })
  loansPaidOnTime: number;
  @ApiProperty({ example: 0 })
  loansPaidLate: number;
  @ApiProperty({ example: 0 })
  loansDefaulted: number;
  @ApiProperty({ example: 0, required: false })
  avgRepaymentTime?: number;
  @ApiProperty({ example: false })
  isDeleted: boolean;
  @ApiProperty({ example: '2026-01-06T12:00:00.000Z', required: false })
  deletedAt?: Date;
  @ApiProperty({ example: '2026-01-06T12:00:00.000Z' })
  createdAt: Date;
  @ApiProperty({ example: '2026-01-06T12:00:00.000Z' })
  updatedAt: Date;
  @ApiProperty({ example: '2026-01-06T12:00:00.000Z', required: false })
  lastLoginAt?: Date;
  // Relations (as IDs or nested objects)
  @ApiProperty({ type: Object, required: false })
  address?: any;
  @ApiProperty({ type: Object, required: false })
  familyDetails?: any;
  @ApiProperty({ type: [Object], required: false })
  verificationDocuments?: any[];
  @ApiProperty({ type: [Object], required: false })
  loansAsBorrower?: any[];
  @ApiProperty({ type: [Object], required: false })
  loansAsLender?: any[];
  @ApiProperty({ type: [Object], required: false })
  loanRequests?: any[];
  @ApiProperty({ type: [Object], required: false })
  sentTransactions?: any[];
  @ApiProperty({ type: [Object], required: false })
  receivedTransactions?: any[];
  @ApiProperty({ type: [Object], required: false })
  notifications?: any[];
  @ApiProperty({ type: [Object], required: false })
  guarantorLoans?: any[];
  @ApiProperty({ type: [Object], required: false })
  trustScoreHistory?: any[];
}
