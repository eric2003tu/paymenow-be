import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { LoanOfferService } from './loan-offer.service';
import { CreateLoanOfferDto } from './dto/create-loan-offer.dto';
import { UpdateLoanOfferDto } from './dto/update-loan-offer.dto';
import { LoanOfferResponseDto } from './dto/loan-offer-response.dto';
import { AdminGuard } from '../common/admin.guard';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Loan Offers')
@ApiBearerAuth()
@Controller('loan-offers')
export class LoanOfferController {
  constructor(private readonly service: LoanOfferService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Create a loan offer (authenticated user becomes lender). User must have verified documents.' })
  @ApiResponse({ status: 201, type: LoanOfferResponseDto })
  @ApiResponse({ status: 400, description: 'User documents not verified' })
  async create(@Body() dto: CreateLoanOfferDto, @Req() req: any) {
    return this.service.create(dto, req.user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'List all loan offers' })
  @ApiResponse({ status: 200, type: [LoanOfferResponseDto] })
  async findAll() {
    return this.service.findAll();
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get my loan offers (authenticated user)' })
  @ApiResponse({ status: 200, type: [LoanOfferResponseDto] })
  async getMyLoanOffers(@Req() req: any) {
    return this.service.findByLenderWithDetails(req.user.sub);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'List loan offers made by a user' })
  async findByUser(@Param('userId') userId: string) {
    return this.service.findByLender(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a loan offer by id' })
  @ApiResponse({ status: 200, type: LoanOfferResponseDto })
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Update your loan offer' })
  @ApiResponse({ status: 200, type: LoanOfferResponseDto })
  async update(@Param('id') id: string, @Body() dto: UpdateLoanOfferDto, @Req() req: any) {
    return this.service.update(id, dto, req.user.sub);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Soft delete your loan offer' })
  @ApiResponse({ status: 200, type: LoanOfferResponseDto })
  async remove(@Param('id') id: string, @Req() req: any) {
    return this.service.remove(id, req.user.sub);
  }
}
