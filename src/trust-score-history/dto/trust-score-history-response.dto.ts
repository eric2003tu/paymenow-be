import { ApiProperty } from '@nestjs/swagger';

export class TrustScoreHistoryResponseDto {
  @ApiProperty({ example: 'history-id-123' })
  id: string;

  @ApiProperty({ example: 'user-id-123' })
  userId: string;

  @ApiProperty({ example: 'loan-id-123', nullable: true })
  loanId: string | null;

  @ApiProperty({ example: 50 })
  oldScore: number;

  @ApiProperty({ example: 60 })
  newScore: number;

  @ApiProperty({ example: 10 })
  change: number;

  @ApiProperty({ example: 'LOAN_REPAID_ON_TIME' })
  reason: string;

  @ApiProperty({ example: { lateDays: 0, amount: 1000 }, nullable: true })
  metadata: any;

  @ApiProperty({ example: '2026-01-07T12:00:00.000Z' })
  createdAt: string;
}
