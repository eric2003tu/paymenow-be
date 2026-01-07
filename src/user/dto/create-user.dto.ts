import { IsEmail, IsNotEmpty, IsString, IsDateString, Length, Matches, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { AddressDto } from './address.dto';
import { FamilyDetailsDto } from './family-details.dto';

export class CreateUserDto {
  @ApiProperty({ example: 'user@email.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '+250788123456' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?[0-9]{7,15}$/)
  phone: string;

  @ApiProperty({ example: 'StrongPassword123!' })
  @IsString()
  @IsNotEmpty()
  @Length(8, 128)
  password: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: '1990-01-01' })
  @IsDateString()
  @IsNotEmpty()
  dateOfBirth: Date;

  @ApiProperty({ example: 'SINGLE', description: 'Marital status: SINGLE, MARRIED, DIVORCED, WIDOWED' })
  @IsString()
  @IsNotEmpty()
  maritalStatus: string;

  @ApiProperty({ example: '1234567890123456' })
  @IsString()
  @IsNotEmpty()
  nationalId: string;

  @ApiProperty({ type: AddressDto })
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @ApiProperty({ type: FamilyDetailsDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => FamilyDetailsDto)
  familyDetails?: FamilyDetailsDto;
}
