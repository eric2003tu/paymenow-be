import { IsEmail, IsString, IsNotEmpty, Length, Matches, IsDateString, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { AddressDto } from '../../user/dto/address.dto';
import { FamilyDetailsDto } from '../../user/dto/family-details.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'example@example.com', description: 'User email address' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '+1234567890', description: 'User phone number' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[+]?\d{7,15}$/)
  phone: string;

  @ApiProperty({ example: 'password123', description: 'User password (8-128 characters)' })
  @IsString()
  @IsNotEmpty()
  @Length(8, 128)
  password: string;

  @ApiProperty({ example: 'John', description: 'User first name' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'User last name' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: '1990-01-01', description: 'User date of birth' })
  @IsDateString()
  @IsNotEmpty()
  dateOfBirth: Date;

  @ApiProperty({ example: 'Single', description: 'User marital status' })
  @IsString()
  @IsNotEmpty()
  maritalStatus: string;

  @ApiProperty({ example: '123456789', description: 'User national ID' })
  @IsString()
  @IsNotEmpty()
  nationalId: string;

  @ApiProperty({ description: 'User address details' })
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @ApiPropertyOptional({ description: 'User family details' })
  @IsOptional()
  @ValidateNested()
  @Type(() => FamilyDetailsDto)
  familyDetails?: FamilyDetailsDto;
}