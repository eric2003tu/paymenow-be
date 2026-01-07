import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsLatitude, IsLongitude } from 'class-validator';

export class AddressDto {
  @ApiProperty({ example: 'country-id-123', description: 'Country ID (from Country table)' })
  @IsString()
  @IsNotEmpty()
  countryId: string;

  @ApiProperty({ example: 'province-id-123', description: 'Province ID (from Province table)' })
  @IsString()
  @IsNotEmpty()
  provinceId: string;

  @ApiProperty({ example: 'district-id-123', description: 'District ID (from District table)' })
  @IsString()
  @IsNotEmpty()
  districtId: string;

  @ApiProperty({ example: 'sector-id-123', description: 'Sector ID (from Sector table)' })
  @IsString()
  @IsNotEmpty()
  sectorId: string;

  @ApiProperty({ example: 'cell-id-123', description: 'Cell ID (from Cell table)' })
  @IsString()
  @IsNotEmpty()
  cellId: string;

  @ApiProperty({ example: 'village-id-123', description: 'Village ID (from Village table)' })
  @IsString()
  @IsNotEmpty()
  villageId: string;

  @ApiProperty({ example: '123 Main St', required: false, description: 'Street address (optional)' })
  @IsOptional()
  @IsString()
  street?: string;

  @ApiProperty({ example: -1.9441, required: false, description: 'Latitude (optional)' })
  @IsOptional()
  @IsLatitude()
  latitude?: number;

  @ApiProperty({ example: 30.0619, required: false, description: 'Longitude (optional)' })
  @IsOptional()
  @IsLongitude()
  longitude?: number;
}
