import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsDateString } from 'class-validator';

export class QueryTrustScoreHistoryDto {
  @ApiProperty({ example: 'user-id-123', required: false, description: 'Filter by user ID' })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({ example: 'loan-id-123', required: false, description: 'Filter by loan ID' })
  @IsOptional()
  @IsString()
  loanId?: string;

  @ApiProperty({ example: 'LOAN_REPAID_ON_TIME', required: false, description: 'Filter by reason' })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z', required: false, description: 'Filter records after this date' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ example: '2026-12-31T23:59:59.999Z', required: false, description: 'Filter records before this date' })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
