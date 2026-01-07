import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { LoanOfferService } from './loan-offer.service';
import { CreateLoanOfferDto } from './dto/create-loan-offer.dto';
import { UpdateLoanOfferDto } from './dto/update-loan-offer.dto';
import { LoanOfferResponseDto } from './dto/loan-offer-response.dto';
import { AdminGuard } from '../common/admin.guard';

@ApiTags('Loan Offers')
@ApiBearerAuth()
@Controller('loan-offers')
export class LoanOfferController {
  constructor(private readonly service: LoanOfferService) {}

  @Post()
  @ApiOperation({ summary: 'Create a loan offer' })
  @ApiResponse({ status: 201, type: LoanOfferResponseDto })
  async create(@Body() dto: CreateLoanOfferDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all loan offers' })
  @ApiResponse({ status: 200, type: [LoanOfferResponseDto] })
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a loan offer by id' })
  @ApiResponse({ status: 200, type: LoanOfferResponseDto })
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Update a loan offer (admin only)' })
  @ApiResponse({ status: 200, type: LoanOfferResponseDto })
  async update(@Param('id') id: string, @Body() dto: UpdateLoanOfferDto) {
    return this.service.update(id, dto, true);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Soft delete a loan offer (admin only)' })
  @ApiResponse({ status: 200, type: LoanOfferResponseDto })
  async remove(@Param('id') id: string) {
    return this.service.remove(id, true);
  }
}
