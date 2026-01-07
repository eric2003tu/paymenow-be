import { Controller, Post, Body, Get, Param, Patch, Delete, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { LoanRequestService } from './loan-request.service';
import { CreateLoanRequestDto } from './dto/create-loan-request.dto';
import { UpdateLoanRequestDto } from './dto/update-loan-request.dto';
import { LoanRequestResponseDto } from './dto/loan-request-response.dto';

// Placeholder AdminGuard for demonstration
class AdminGuard {
  canActivate(context) {
    // Implement your admin check logic here
    return true;
  }
}

@ApiTags('LoanRequest')
@Controller('loan-request')
export class LoanRequestController {
  constructor(private readonly loanRequestService: LoanRequestService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new loan request' })
  @ApiBody({ type: CreateLoanRequestDto })
  @ApiResponse({ status: 201, type: LoanRequestResponseDto })
  async create(@Body() dto: CreateLoanRequestDto) {
    return this.loanRequestService.createLoanRequest(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all loan requests' })
  @ApiResponse({ status: 200, type: [LoanRequestResponseDto] })
  async findAll() {
    return this.loanRequestService.findAll();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get loan requests created by a user' })
  @ApiParam({ name: 'userId', example: 'user-id-123' })
  @ApiResponse({ status: 200, type: [LoanRequestResponseDto] })
  async findByUser(@Param('userId') userId: string) {
    return this.loanRequestService.findByBorrower(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get loan request by ID' })
  @ApiParam({ name: 'id', example: 'loan-request-id-123' })
  @ApiResponse({ status: 200, type: LoanRequestResponseDto })
  async findOne(@Param('id') id: string) {
    return this.loanRequestService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Update loan request by ID (admin only)' })
  @ApiParam({ name: 'id', example: 'loan-request-id-123' })
  @ApiBody({ type: UpdateLoanRequestDto })
  @ApiResponse({ status: 200, type: LoanRequestResponseDto })
  async update(@Param('id') id: string, @Body() dto: UpdateLoanRequestDto) {
    return this.loanRequestService.updateLoanRequest(id, dto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Soft delete loan request by ID (admin only)' })
  @ApiParam({ name: 'id', example: 'loan-request-id-123' })
  @ApiResponse({ status: 204 })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.loanRequestService.softDeleteLoanRequest(id);
  }
}
