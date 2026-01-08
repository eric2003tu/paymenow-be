import { Controller, Get, Param, BadRequestException } from '@nestjs/common';
import { AddressService } from './address.service';
import { ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { AddressHierarchyResponseDto } from './dto/hierarchy-response.dto';
import { CountryDto, ProvinceDto, DistrictDto, SectorDto, CellDto, VillageDto } from './dto/location.dto';

@ApiTags('Address')
@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  // Progressive discovery endpoints
  @Get('countries')
  @ApiOperation({ summary: 'List countries' })
  @ApiOkResponse({ type: [CountryDto] })
  async getCountries(): Promise<CountryDto[]> {
    return this.addressService.getCountries();
  }

  @Get('provinces/:countryId')
  @ApiOperation({ summary: 'List provinces by country' })
  @ApiParam({ name: 'countryId' })
  @ApiOkResponse({ type: [ProvinceDto] })
  async getProvinces(@Param('countryId') countryId: string): Promise<ProvinceDto[]> {
    return this.addressService.getProvincesByCountry(countryId);
  }

  @Get('districts/:provinceId')
  @ApiOperation({ summary: 'List districts by province' })
  @ApiParam({ name: 'provinceId' })
  @ApiOkResponse({ type: [DistrictDto] })
  async getDistricts(@Param('provinceId') provinceId: string): Promise<DistrictDto[]> {
    return this.addressService.getDistrictsByProvince(provinceId);
  }

  @Get('sectors/:districtId')
  @ApiOperation({ summary: 'List sectors by district' })
  @ApiParam({ name: 'districtId' })
  @ApiOkResponse({ type: [SectorDto] })
  async getSectors(@Param('districtId') districtId: string): Promise<SectorDto[]> {
    return this.addressService.getSectorsByDistrict(districtId);
  }

  @Get('cells/:sectorId')
  @ApiOperation({ summary: 'List cells by sector' })
  @ApiParam({ name: 'sectorId' })
  @ApiOkResponse({ type: [CellDto] })
  async getCells(@Param('sectorId') sectorId: string): Promise<CellDto[]> {
    return this.addressService.getCellsBySector(sectorId);
  }

  @Get('villages/:cellId')
  @ApiOperation({ summary: 'List villages by cell' })
  @ApiParam({ name: 'cellId' })
  @ApiOkResponse({ type: [VillageDto] })
  async getVillages(@Param('cellId') cellId: string): Promise<VillageDto[]> {
    return this.addressService.getVillagesByCell(cellId);
  }

  @Get(':level/:id')
  @ApiOperation({
    summary: 'Get hierarchical address data by level and id',
    description:
      'Level can be country, province, district, sector, cell, or village. Returns parents and descendants flattened by level.',
  })
  @ApiParam({ name: 'level', enum: ['country', 'province', 'district', 'sector', 'cell', 'village'] })
  @ApiParam({ name: 'id', description: 'The entity ID for the given level' })
  @ApiOkResponse({ description: 'Hierarchy payload', type: AddressHierarchyResponseDto })
  async getAddressHierarchy(@Param('level') level: string, @Param('id') id: string): Promise<AddressHierarchyResponseDto> {
    const lower = (level || '').toLowerCase();
    const allowed = ['country', 'province', 'district', 'sector', 'cell', 'village'];
    if (!allowed.includes(lower)) {
      throw new BadRequestException(`level must be one of: ${allowed.join(', ')}`);
    }
    return this.addressService.getHierarchy(lower as any, id);
  }
}
