import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsDateString, IsBoolean } from 'class-validator';

export class CreateLoanDto {
  @ApiProperty({ example: 'borrower-id-123' })
  @IsString()
  @IsNotEmpty()
  borrowerId: string;

  @ApiProperty({ example: 'lender-id-123' })
  @IsString()
  @IsNotEmpty()
  lenderId: string;

  @ApiProperty({ example: 1000.00 })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ example: 6.0, required: false, description: 'Interest rate as percent per month. Defaults to 6% if not provided.' })
  @IsNumber()
  @IsOptional()
  interestRate?: number;

  @ApiProperty({ example: 30, description: 'Duration in days' })
  @IsNumber()
  @IsNotEmpty()
  durationDays: number;

  @ApiProperty({ example: 'Personal loan for school fees', required: false })
  @IsOptional()
  @IsString()
  purpose?: string;

  @ApiProperty({ example: '2026-01-06T12:00:00.000Z', required: false })
  @IsOptional()
  @IsDateString()
  disbursedAt?: string;

  @ApiProperty({ example: '2026-02-06T12:00:00.000Z', required: false })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiProperty({ example: '2026-03-06T12:00:00.000Z', required: false })
  @IsOptional()
  @IsDateString()
  repaidAt?: string;

  @ApiProperty({ example: 1060.00, description: 'Total amount (principal + interest)' })
  @IsNumber()
  @IsOptional()
  totalAmount?: number;

  @ApiProperty({ example: 0, description: 'Amount paid so far' })
  @IsNumber()
  @IsOptional()
  amountPaid?: number;

  @ApiProperty({ example: 1060.00, description: 'Amount due' })
  @IsNumber()
  @IsOptional()
  amountDue?: number;

  @ApiProperty({ example: 'PENDING', description: 'Loan status' })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ example: false, description: 'Is the loan late?' })
  @IsBoolean()
  @IsOptional()
  isLate?: boolean;

  @ApiProperty({ example: 0, description: 'Number of late days' })
  @IsNumber()
  @IsOptional()
  lateDays?: number;

  @ApiProperty({ example: 0, description: 'Penalty amount' })
  @IsNumber()
  @IsOptional()
  penaltyAmount?: number;

  @ApiProperty({ example: 'https://example.com/agreement.pdf', required: false })
  @IsOptional()
  @IsString()
  agreementUrl?: string;

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsOptional()
  signedByBorrower?: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsOptional()
  signedByLender?: boolean;
}
