import { ApiProperty } from '@nestjs/swagger';

export class LoanRequestResponseDto {
  @ApiProperty({ example: 'loan-request-id-123' })
  id: string;
  @ApiProperty({ example: 'borrower-id-123' })
  borrowerId: string;
  @ApiProperty({ example: 1000.00 })
  amount: number;
  @ApiProperty({ example: 500.00 })
  minAmount?: number;
  @ApiProperty({ example: 6.0 })
  interestRate: number;
  @ApiProperty({ example: 30 })
  durationDays: number;
  @ApiProperty({ example: 'Loan for business' })
  purpose?: string;
  @ApiProperty({ example: 0 })
  amountFunded: number;
  @ApiProperty({ example: 1000.00 })
  amountNeeded: number;
  @ApiProperty({ example: 'OPEN' })
  status: string;
  @ApiProperty({ example: '2026-01-13T12:00:00.000Z' })
  fundingDeadline?: string;
  @ApiProperty({ example: true })
  isPublic: boolean;
  @ApiProperty({ example: 1 })
  maxLenders: number;
  @ApiProperty({ example: '2026-01-06T12:00:00.000Z' })
  createdAt: string;
  @ApiProperty({ example: '2026-01-06T12:00:00.000Z' })
  updatedAt: string;
  @ApiProperty({ example: '2026-01-13T12:00:00.000Z' })
  expiresAt?: string;
}
