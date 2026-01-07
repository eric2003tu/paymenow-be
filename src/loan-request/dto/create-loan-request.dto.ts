import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsDateString, IsBoolean } from 'class-validator';

export class CreateLoanRequestDto {
  @ApiProperty({ example: 1000.00 })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ example: 500.00, required: false, description: 'Minimum amount for partial funding' })
  @IsOptional()
  @IsNumber()
  minAmount?: number;

  @ApiProperty({ example: 6.0, required: false, description: 'Interest rate as percent per month. Defaults to 6% if not provided.' })
  @IsOptional()
  @IsNumber()
  interestRate?: number;

  @ApiProperty({ example: 30 })
  @IsNumber()
  @IsNotEmpty()
  durationDays: number;

  @ApiProperty({ example: 'Loan for business', required: false })
  @IsOptional()
  @IsString()
  purpose?: string;

  @ApiProperty({ example: 0, required: false, description: 'Amount funded so far' })
  @IsOptional()
  @IsNumber()
  amountFunded?: number;

  @ApiProperty({ example: 1000.00, required: false, description: 'Amount still needed' })
  @IsOptional()
  @IsNumber()
  amountNeeded?: number;

  @ApiProperty({ example: 'OPEN', required: false, description: 'Loan request status' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ example: '2026-01-13T12:00:00.000Z', required: false, description: 'Funding deadline' })
  @IsOptional()
  @IsDateString()
  fundingDeadline?: string;

  @ApiProperty({ example: true, required: false, description: 'Is the request public?' })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @ApiProperty({ example: 1, required: false, description: 'Max number of lenders' })
  @IsOptional()
  @IsNumber()
  maxLenders?: number;

  @ApiProperty({ example: '2026-01-06T12:00:00.000Z', required: false, description: 'Expires at' })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
