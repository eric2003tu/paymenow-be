import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';

export class UpdateLoanOfferDto {
  @ApiProperty({ example: 6.0, required: false })
  @IsOptional()
  @IsNumber()
  interestRate?: number;

  @ApiProperty({ example: 1000.00, required: false })
  @IsOptional()
  @IsNumber()
  amount?: number;

  @ApiProperty({ example: 'ACCEPTED', required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isCounterOffer?: boolean;

  @ApiProperty({ example: 'Updated offer message', required: false })
  @IsOptional()
  @IsString()
  message?: string;
}
