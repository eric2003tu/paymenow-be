import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsDateString, IsBoolean } from 'class-validator';

export class UpdateLoanRequestDto {
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

  @ApiProperty({ example: 1000.00, required: false })
  @IsOptional()
  @IsNumber()
  amount?: number;

  @ApiProperty({ example: 500.00, required: false })
  @IsOptional()
  @IsNumber()
  minAmount?: number;

  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  @IsNumber()
  amountFunded?: number;

  @ApiProperty({ example: 1000.00, required: false })
  @IsOptional()
  @IsNumber()
  amountNeeded?: number;

  @ApiProperty({ example: 'FUNDED', required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ example: '2026-01-13T12:00:00.000Z', required: false })
  @IsOptional()
  @IsDateString()
  fundingDeadline?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  maxLenders?: number;

  @ApiProperty({ example: '2026-01-06T12:00:00.000Z', required: false })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
