import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsObject } from 'class-validator';

export class CreateTrustScoreHistoryDto {
  @ApiProperty({ example: 'user-id-123', description: 'User ID' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ example: 'loan-id-123', required: false, description: 'Related loan ID (optional)' })
  @IsString()
  @IsOptional()
  loanId?: string;

  @ApiProperty({ example: 50, description: 'Previous trust score' })
  @IsNumber()
  @IsNotEmpty()
  oldScore: number;

  @ApiProperty({ example: 60, description: 'New trust score' })
  @IsNumber()
  @IsNotEmpty()
  newScore: number;

  @ApiProperty({ example: 'LOAN_REPAID_ON_TIME', description: 'Reason for score change' })
  @IsString()
  @IsNotEmpty()
  reason: string;

  @ApiProperty({ 
    example: { lateDays: 0, amount: 1000 }, 
    required: false,
    description: 'Additional metadata about the score change' 
  })
  @IsObject()
  @IsOptional()
  metadata?: any;
}
