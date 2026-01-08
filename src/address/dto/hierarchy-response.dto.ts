import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CellDto, CountryDto, DistrictDto, ProvinceDto, SectorDto, VillageDto } from './location.dto';

export type AddressLevel = 'country' | 'province' | 'district' | 'sector' | 'cell' | 'village';

export class ParentsDto {
  @ApiPropertyOptional({ type: CountryDto })
  country?: CountryDto;
  @ApiPropertyOptional({ type: ProvinceDto })
  province?: ProvinceDto;
  @ApiPropertyOptional({ type: DistrictDto })
  district?: DistrictDto;
  @ApiPropertyOptional({ type: SectorDto })
  sector?: SectorDto;
  @ApiPropertyOptional({ type: CellDto })
  cell?: CellDto;
}

export class ChildrenDto {
  @ApiPropertyOptional({ type: [ProvinceDto] })
  provinces?: ProvinceDto[];
  @ApiPropertyOptional({ type: [DistrictDto] })
  districts?: DistrictDto[];
  @ApiPropertyOptional({ type: [SectorDto] })
  sectors?: SectorDto[];
  @ApiPropertyOptional({ type: [CellDto] })
  cells?: CellDto[];
  @ApiPropertyOptional({ type: [VillageDto] })
  villages?: VillageDto[];
}

export class AddressHierarchyResponseDto {
  @ApiProperty({ enum: ['country', 'province', 'district', 'sector', 'cell', 'village'] })
  level: AddressLevel;

  @ApiProperty({ type: ParentsDto })
  parents: ParentsDto;

  @ApiProperty({
    oneOf: [
      { $ref: '#/components/schemas/CountryDto' },
      { $ref: '#/components/schemas/ProvinceDto' },
      { $ref: '#/components/schemas/DistrictDto' },
      { $ref: '#/components/schemas/SectorDto' },
      { $ref: '#/components/schemas/CellDto' },
      { $ref: '#/components/schemas/VillageDto' },
    ],
  })
  current: CountryDto | ProvinceDto | DistrictDto | SectorDto | CellDto | VillageDto;

  @ApiProperty({ type: ChildrenDto })
  children: ChildrenDto;
}
