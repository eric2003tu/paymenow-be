import { ApiProperty } from '@nestjs/swagger';

export class LoanResponseDto {
  @ApiProperty({ example: 'loan-id-123' })
  id: string;
  @ApiProperty({ example: 'LN-2026-0001' })
  loanNumber: string;
  @ApiProperty({ example: 'borrower-id-123' })
  borrowerId: string;
  @ApiProperty({ example: 'lender-id-123' })
  lenderId: string;
  @ApiProperty({ example: 1000.00 })
  amount: number;
  @ApiProperty({ example: 6.0 })
  interestRate: number;
  @ApiProperty({ example: 30 })
  durationDays: number;
  @ApiProperty({ example: 'Personal loan for school fees' })
  purpose?: string;
  @ApiProperty({ example: '2026-01-06T12:00:00.000Z' })
  disbursedAt?: string;
  @ApiProperty({ example: '2026-02-06T12:00:00.000Z' })
  dueDate?: string;
  @ApiProperty({ example: '2026-03-06T12:00:00.000Z' })
  repaidAt?: string;
  @ApiProperty({ example: 1060.00 })
  totalAmount: number;
  @ApiProperty({ example: 0 })
  amountPaid: number;
  @ApiProperty({ example: 1060.00 })
  amountDue: number;
  @ApiProperty({ example: 'PENDING' })
  status: string;
  @ApiProperty({ example: false })
  isLate: boolean;
  @ApiProperty({ example: 0 })
  lateDays: number;
  @ApiProperty({ example: 0 })
  penaltyAmount: number;
  @ApiProperty({ example: 'https://example.com/agreement.pdf' })
  agreementUrl?: string;
  @ApiProperty({ example: false })
  signedByBorrower: boolean;
  @ApiProperty({ example: false })
  signedByLender: boolean;
  @ApiProperty({ example: false })
  isDeleted: boolean;
  @ApiProperty({ example: '2026-01-06T12:00:00.000Z' })
  createdAt: string;
  @ApiProperty({ example: '2026-01-06T12:00:00.000Z' })
  updatedAt: string;
  @ApiProperty({ example: null })
  deletedAt?: string;
}
