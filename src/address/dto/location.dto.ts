import { ApiProperty } from '@nestjs/swagger';

export class CountryDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  code: string;
}

export class ProvinceDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty({ required: false, nullable: true })
  code?: string | null;
}

export class DistrictDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty({ required: false, nullable: true })
  code?: string | null;
}

export class SectorDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty({ required: false, nullable: true })
  code?: string | null;
}

export class CellDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty({ required: false, nullable: true })
  code?: string | null;
}

export class VillageDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty({ required: false, nullable: true })
  code?: string | null;
}
