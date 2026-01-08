import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AddressHierarchyResponseDto, ChildrenDto, ParentsDto } from './dto/hierarchy-response.dto';
import { CellDto, CountryDto, DistrictDto, ProvinceDto, SectorDto, VillageDto } from './dto/location.dto';

type Level = 'country' | 'province' | 'district' | 'sector' | 'cell' | 'village';

@Injectable()
export class AddressService {
  constructor(private readonly prisma: PrismaService) {}

  async getHierarchy(level: Level, id: string): Promise<AddressHierarchyResponseDto> {
    switch (level) {
      case 'country':
        return this.getCountryHierarchy(id);
      case 'province':
        return this.getProvinceHierarchy(id);
      case 'district':
        return this.getDistrictHierarchy(id);
      case 'sector':
        return this.getSectorHierarchy(id);
      case 'cell':
        return this.getCellHierarchy(id);
      case 'village':
        return this.getVillageHierarchy(id);
      default:
        throw new BadRequestException('Invalid level parameter');
    }
  }

  // Listing endpoints for progressive discovery
  async getCountries(): Promise<CountryDto[]> {
    const countries = await this.prisma.country.findMany({
      where: { isDeleted: false, isActive: true },
      orderBy: { name: 'asc' },
    });
    return countries.map(this.mapCountry);
  }

  async getProvincesByCountry(countryId: string): Promise<ProvinceDto[]> {
    const provinces = await this.prisma.province.findMany({
      where: { countryId, isDeleted: false, isActive: true },
      orderBy: { name: 'asc' },
    });
    return provinces.map(this.mapProvince);
  }

  async getDistrictsByProvince(provinceId: string): Promise<DistrictDto[]> {
    const districts = await this.prisma.district.findMany({
      where: { provinceId, isDeleted: false, isActive: true },
      orderBy: { name: 'asc' },
    });
    return districts.map(this.mapDistrict);
  }

  async getSectorsByDistrict(districtId: string): Promise<SectorDto[]> {
    const sectors = await this.prisma.sector.findMany({
      where: { districtId, isDeleted: false, isActive: true },
      orderBy: { name: 'asc' },
    });
    return sectors.map(this.mapSector);
  }

  async getCellsBySector(sectorId: string): Promise<CellDto[]> {
    const cells = await this.prisma.cell.findMany({
      where: { sectorId, isDeleted: false, isActive: true },
      orderBy: { name: 'asc' },
    });
    return cells.map(this.mapCell);
  }

  async getVillagesByCell(cellId: string): Promise<VillageDto[]> {
    const villages = await this.prisma.village.findMany({
      where: { cellId, isDeleted: false, isActive: true },
      orderBy: { name: 'asc' },
    });
    return villages.map(this.mapVillage);
  }

  private async getCountryHierarchy(countryId: string): Promise<AddressHierarchyResponseDto> {
    const country = await this.prisma.country.findUnique({
      where: { id: countryId },
      include: {
        provinces: {
          where: { isDeleted: false, isActive: true },
          include: {
            districts: {
              where: { isDeleted: false, isActive: true },
              include: {
                sectors: {
                  where: { isDeleted: false, isActive: true },
                  include: {
                    cells: {
                      where: { isDeleted: false, isActive: true },
                      include: {
                        villages: { where: { isDeleted: false, isActive: true } },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
    if (!country) throw new NotFoundException('Country not found');
    const provinces: ProvinceDto[] = country.provinces.map(this.mapProvince);
    const districts: DistrictDto[] = country.provinces.flatMap((p) => p.districts.map(this.mapDistrict));
    const sectors: SectorDto[] = country.provinces.flatMap((p) => p.districts.flatMap((d) => d.sectors.map(this.mapSector)));
    const cells: CellDto[] = country.provinces.flatMap((p) =>
      p.districts.flatMap((d) => d.sectors.flatMap((s) => s.cells.map(this.mapCell))),
    );
    const villages: VillageDto[] = country.provinces.flatMap((p) =>
      p.districts.flatMap((d) => d.sectors.flatMap((s) => s.cells.flatMap((c) => c.villages.map(this.mapVillage)))),
    );

    return {
      level: 'country',
      parents: {},
      current: this.mapCountry(country),
      children: { provinces, districts, sectors, cells, villages },
    };
  }

  private async getProvinceHierarchy(provinceId: string): Promise<AddressHierarchyResponseDto> {
    const province = await this.prisma.province.findUnique({
      where: { id: provinceId },
      include: {
        country: true,
        districts: {
          where: { isDeleted: false, isActive: true },
          include: {
            sectors: {
              where: { isDeleted: false, isActive: true },
              include: {
                cells: {
                  where: { isDeleted: false, isActive: true },
                  include: {
                    villages: { where: { isDeleted: false, isActive: true } },
                  },
                },
              },
            },
          },
        },
      },
    });
    if (!province) throw new NotFoundException('Province not found');
    const districts: DistrictDto[] = province.districts.map(this.mapDistrict);
    const sectors: SectorDto[] = province.districts.flatMap((d) => d.sectors.map(this.mapSector));
    const cells: CellDto[] = province.districts.flatMap((d) => d.sectors.flatMap((s) => s.cells.map(this.mapCell)));
    const villages: VillageDto[] = province.districts.flatMap((d) =>
      d.sectors.flatMap((s) => s.cells.flatMap((c) => c.villages.map(this.mapVillage))),
    );
    const parents: ParentsDto = { country: this.mapCountry(province.country) };
    return {
      level: 'province',
      parents,
      current: this.mapProvince(province),
      children: { districts, sectors, cells, villages },
    };
  }

  private async getDistrictHierarchy(districtId: string): Promise<AddressHierarchyResponseDto> {
    const district = await this.prisma.district.findUnique({
      where: { id: districtId },
      include: {
        province: { include: { country: true } },
        sectors: {
          where: { isDeleted: false, isActive: true },
          include: {
            cells: {
              where: { isDeleted: false, isActive: true },
              include: {
                villages: { where: { isDeleted: false, isActive: true } },
              },
            },
          },
        },
      },
    });
    if (!district) throw new NotFoundException('District not found');
    const sectors: SectorDto[] = district.sectors.map(this.mapSector);
    const cells: CellDto[] = district.sectors.flatMap((s) => s.cells.map(this.mapCell));
    const villages: VillageDto[] = district.sectors.flatMap((s) => s.cells.flatMap((c) => c.villages.map(this.mapVillage)));
    const parents: ParentsDto = {
      country: this.mapCountry(district.province.country),
      province: this.mapProvince(district.province),
    };
    return {
      level: 'district',
      parents,
      current: this.mapDistrict(district),
      children: { sectors, cells, villages },
    };
  }

  private async getSectorHierarchy(sectorId: string): Promise<AddressHierarchyResponseDto> {
    const sector = await this.prisma.sector.findUnique({
      where: { id: sectorId },
      include: {
        district: { include: { province: { include: { country: true } } } },
        cells: {
          where: { isDeleted: false, isActive: true },
          include: {
            villages: { where: { isDeleted: false, isActive: true } },
          },
        },
      },
    });
    if (!sector) throw new NotFoundException('Sector not found');
    const cells: CellDto[] = sector.cells.map(this.mapCell);
    const villages: VillageDto[] = sector.cells.flatMap((c) => c.villages.map(this.mapVillage));
    const parents: ParentsDto = {
      country: this.mapCountry(sector.district.province.country),
      province: this.mapProvince(sector.district.province),
      district: this.mapDistrict(sector.district),
    };
    return {
      level: 'sector',
      parents,
      current: this.mapSector(sector),
      children: { cells, villages },
    };
  }

  private async getCellHierarchy(cellId: string): Promise<AddressHierarchyResponseDto> {
    const cell = await this.prisma.cell.findUnique({
      where: { id: cellId },
      include: {
        sector: { include: { district: { include: { province: { include: { country: true } } } } } },
        villages: { where: { isDeleted: false, isActive: true } },
      },
    });
    if (!cell) throw new NotFoundException('Cell not found');
    const villages: VillageDto[] = cell.villages.map(this.mapVillage);
    const parents: ParentsDto = {
      country: this.mapCountry(cell.sector.district.province.country),
      province: this.mapProvince(cell.sector.district.province),
      district: this.mapDistrict(cell.sector.district),
      sector: this.mapSector(cell.sector),
    };
    return {
      level: 'cell',
      parents,
      current: this.mapCell(cell),
      children: { villages },
    };
  }

  private async getVillageHierarchy(villageId: string): Promise<AddressHierarchyResponseDto> {
    const village = await this.prisma.village.findUnique({
      where: { id: villageId },
      include: {
        cell: { include: { sector: { include: { district: { include: { province: { include: { country: true } } } } } } } },
      },
    });
    if (!village) throw new NotFoundException('Village not found');
    const parents: ParentsDto = {
      country: this.mapCountry(village.cell.sector.district.province.country),
      province: this.mapProvince(village.cell.sector.district.province),
      district: this.mapDistrict(village.cell.sector.district),
      sector: this.mapSector(village.cell.sector),
      cell: this.mapCell(village.cell),
    };
    return {
      level: 'village',
      parents,
      current: this.mapVillage(village),
      children: {},
    };
  }

  private mapCountry = (c: any): CountryDto => ({ id: c.id, name: c.name, code: c.code });
  private mapProvince = (p: any): ProvinceDto => ({ id: p.id, name: p.name, code: p.code ?? null });
  private mapDistrict = (d: any): DistrictDto => ({ id: d.id, name: d.name, code: d.code ?? null });
  private mapSector = (s: any): SectorDto => ({ id: s.id, name: s.name, code: s.code ?? null });
  private mapCell = (c: any): CellDto => ({ id: c.id, name: c.name, code: c.code ?? null });
  private mapVillage = (v: any): VillageDto => ({ id: v.id, name: v.name, code: v.code ?? null });
}
