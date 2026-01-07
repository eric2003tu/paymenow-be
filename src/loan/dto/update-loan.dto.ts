import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsDateString, IsBoolean } from 'class-validator';

export class UpdateLoanDto {
  @ApiProperty({ example: 6.0, required: false })
  @IsOptional()
  @IsNumber()
  interestRate?: number;

  @ApiProperty({ example: 30, required: false })
  @IsOptional()
  @IsNumber()
  durationDays?: number;

  @ApiProperty({ example: 'Updated purpose', required: false })
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

  @ApiProperty({ example: 1060.00, required: false })
  @IsOptional()
  @IsNumber()
  totalAmount?: number;

  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  @IsNumber()
  amountPaid?: number;

  @ApiProperty({ example: 1060.00, required: false })
  @IsOptional()
  @IsNumber()
  amountDue?: number;

  @ApiProperty({ example: 'ACTIVE', required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isLate?: boolean;

  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  @IsNumber()
  lateDays?: number;

  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  @IsNumber()
  penaltyAmount?: number;

  @ApiProperty({ example: 'https://example.com/agreement.pdf', required: false })
  @IsOptional()
  @IsString()
  agreementUrl?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  signedByBorrower?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  signedByLender?: boolean;
}
