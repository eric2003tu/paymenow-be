import { ApiProperty } from '@nestjs/swagger';

export class UserListResponseDto {
  @ApiProperty({ example: 'user-id-123' })
  id: string;
  @ApiProperty({ example: 'user@email.com' })
  email: string;
  @ApiProperty({ example: '+250788123456' })
  phone: string;
  @ApiProperty({ example: 'John' })
  firstName: string;
  @ApiProperty({ example: 'Doe' })
  lastName: string;
  @ApiProperty({ example: 'ACTIVE' })
  status: string;
  @ApiProperty({ example: 'MODERATE' })
  category: string;
  @ApiProperty({ example: 50 })
  trustScore: number;
  @ApiProperty({ example: '0.00' })
  walletBalance: string;
  @ApiProperty({ example: '2026-01-06T12:00:00.000Z' })
  createdAt: Date;
}
