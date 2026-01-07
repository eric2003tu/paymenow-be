import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ChildDto {
  @ApiProperty({ example: 'Jane Doe', description: 'Child name' })
  @IsString()
  name: string;

  @ApiProperty({ example: '2015-06-01', description: 'Child date of birth' })
  @IsString()
  dateOfBirth: string;

  @ApiProperty({ example: '1234567890123456', required: false, description: 'Child national ID (optional)' })
  @IsOptional()
  @IsString()
  nationalId?: string;
}

export class FamilyDetailsDto {
  @ApiProperty({ example: 'Spouse Name', required: false, description: 'Spouse name (optional)' })
  @IsOptional()
  @IsString()
  spouseName?: string;

  @ApiProperty({ example: '1234567890123456', required: false, description: 'Spouse national ID (optional)' })
  @IsOptional()
  @IsString()
  spouseNationalId?: string;

  @ApiProperty({ example: '+250788123456', required: false, description: 'Spouse phone (optional)' })
  @IsOptional()
  @IsString()
  spousePhone?: string;

  @ApiProperty({ example: 'Father Name', required: false, description: 'Father name (optional)' })
  @IsOptional()
  @IsString()
  fatherName?: string;

  @ApiProperty({ example: '1234567890123456', required: false, description: 'Father national ID (optional)' })
  @IsOptional()
  @IsString()
  fatherNationalId?: string;

  @ApiProperty({ example: '+250788123457', required: false, description: 'Father phone (optional)' })
  @IsOptional()
  @IsString()
  fatherPhone?: string;

  @ApiProperty({ example: 'Mother Name', required: false, description: 'Mother name (optional)' })
  @IsOptional()
  @IsString()
  motherName?: string;

  @ApiProperty({ example: '1234567890123456', required: false, description: 'Mother national ID (optional)' })
  @IsOptional()
  @IsString()
  motherNationalId?: string;

  @ApiProperty({ example: '+250788123458', required: false, description: 'Mother phone (optional)' })
  @IsOptional()
  @IsString()
  motherPhone?: string;

  @ApiProperty({ example: 'Emergency Contact', required: false, description: 'Emergency contact name (optional)' })
  @IsOptional()
  @IsString()
  emergencyContactName?: string;

  @ApiProperty({ example: '+250788123459', required: false, description: 'Emergency contact phone (optional)' })
  @IsOptional()
  @IsString()
  emergencyContactPhone?: string;

  @ApiProperty({ example: 'Sister', required: false, description: 'Emergency contact relation (optional)' })
  @IsOptional()
  @IsString()
  emergencyContactRelation?: string;

  @ApiProperty({ type: [ChildDto], required: false, description: 'List of children (optional)' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChildDto)
  children?: ChildDto[];
}
