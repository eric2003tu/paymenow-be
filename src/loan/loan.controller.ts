import { Controller, Post, Body, Get, Param, Patch, Delete, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { LoanService } from './loan.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { LoanResponseDto } from './dto/loan-response.dto';

// Placeholder AdminGuard for demonstration
class AdminGuard {
  canActivate(context) {
    // Implement your admin check logic here
    return true;
  }
}

@ApiTags('Loan')
@Controller('loan')
export class LoanController {
  constructor(private readonly loanService: LoanService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new loan' })
  @ApiBody({ type: CreateLoanDto })
  @ApiResponse({ status: 201, type: LoanResponseDto })
  async create(@Body() dto: CreateLoanDto) {
    return this.loanService.createLoan(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all loans' })
  @ApiResponse({ status: 200, type: [LoanResponseDto] })
  async findAll() {
    return this.loanService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get loan by ID' })
  @ApiParam({ name: 'id', example: 'loan-id-123' })
  @ApiResponse({ status: 200, type: LoanResponseDto })
  async findOne(@Param('id') id: string) {
    return this.loanService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Update loan by ID (admin only)' })
  @ApiParam({ name: 'id', example: 'loan-id-123' })
  @ApiBody({ type: UpdateLoanDto })
  @ApiResponse({ status: 200, type: LoanResponseDto })
  async update(@Param('id') id: string, @Body() dto: UpdateLoanDto) {
    return this.loanService.updateLoan(id, dto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Soft delete loan by ID (admin only)' })
  @ApiParam({ name: 'id', example: 'loan-id-123' })
  @ApiResponse({ status: 204 })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.loanService.softDeleteLoan(id);
  }

  @Patch(':id/repaid')
  @ApiOperation({ summary: 'Mark loan as repaid and automatically update borrower trust score' })
  @ApiParam({ name: 'id', example: 'loan-id-123' })
  @ApiResponse({ status: 200, type: LoanResponseDto, description: 'Loan marked as repaid, trust score updated' })
  async markAsRepaid(@Param('id') id: string) {
    return this.loanService.markLoanAsRepaid(id);
  }

  @Patch(':id/defaulted')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Mark loan as defaulted and automatically update borrower trust score (admin only)' })
  @ApiParam({ name: 'id', example: 'loan-id-123' })
  @ApiResponse({ status: 200, type: LoanResponseDto, description: 'Loan marked as defaulted, trust score updated' })
  async markAsDefaulted(@Param('id') id: string) {
    return this.loanService.markLoanAsDefaulted(id);
  }

  @Patch(':id/status')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Update loan status with automatic trust score tracking (admin only)' })
  @ApiParam({ name: 'id', example: 'loan-id-123' })
  @ApiBody({ 
    schema: { 
      type: 'object', 
      properties: { 
        status: { 
          type: 'string', 
          enum: ['PENDING', 'ACTIVE', 'REPAID', 'DEFAULTED', 'CANCELLED', 'OVERDUE'],
          example: 'REPAID'
        } 
      },
      required: ['status']
    } 
  })
  @ApiResponse({ status: 200, type: LoanResponseDto, description: 'Loan status updated, trust score updated if applicable' })
  async updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.loanService.updateLoanStatus(id, body.status as any);
  }
}
