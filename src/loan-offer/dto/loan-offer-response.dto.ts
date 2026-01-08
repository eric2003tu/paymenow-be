import { ApiProperty } from '@nestjs/swagger';
import { FullUserResponseDto } from '../../user/dto/full-user-response.dto';

export class LoanOfferResponseDto {
  @ApiProperty({ example: 'loan-offer-id-123' })
  id: string;
  @ApiProperty({ example: 'loan-request-id-123' })
  loanRequestId: string;
  @ApiProperty({ example: 'lender-id-123' })
  lenderId: string;
  @ApiProperty({ example: 1000.00 })
  amount: number;
  @ApiProperty({ example: 6.0 })
  interestRate: number;
  @ApiProperty({ example: 'PENDING' })
  status: string;
  @ApiProperty({ example: false })
  isCounterOffer: boolean;
  @ApiProperty({ example: 'Can you accept 6%?' })
  message?: string;
  @ApiProperty({ example: '2026-01-06T12:00:00.000Z' })
  createdAt: string;
  @ApiProperty({ example: '2026-01-06T12:00:00.000Z' })
  updatedAt: string;

  @ApiProperty({ type: FullUserResponseDto, required: false })
  borrower?: FullUserResponseDto;
}
