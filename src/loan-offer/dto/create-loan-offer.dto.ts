import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateLoanOfferDto {
  @ApiProperty({ example: 'loan-request-id-123' })
  @IsString()
  @IsNotEmpty()
  loanRequestId: string;

  @ApiProperty({ example: 'lender-id-123' })
  @IsString()
  @IsNotEmpty()
  lenderId: string;

  @ApiProperty({ example: 1000.00 })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ example: 6.0, required: false, description: 'Interest rate as percent per month. Defaults to 6% if not provided.' })
  @IsOptional()
  @IsNumber()
  interestRate?: number;

  @ApiProperty({ example: 'PENDING', required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ example: false, required: false, description: 'Is this a counter offer?' })
  @IsOptional()
  @IsBoolean()
  isCounterOffer?: boolean;

  @ApiProperty({ example: 'Can you accept 6%?', required: false })
  @IsOptional()
  @IsString()
  message?: string;
}
