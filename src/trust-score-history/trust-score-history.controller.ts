import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { TrustScoreHistoryService } from './trust-score-history.service';
import { CreateTrustScoreHistoryDto } from './dto/create-trust-score-history.dto';
import { TrustScoreHistoryResponseDto } from './dto/trust-score-history-response.dto';
import { QueryTrustScoreHistoryDto } from './dto/query-trust-score-history.dto';

@ApiTags('Trust Score History')
@Controller('trust-score-history')
export class TrustScoreHistoryController {
  constructor(private readonly trustScoreHistoryService: TrustScoreHistoryService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new trust score history entry' })
  @ApiBody({ type: CreateTrustScoreHistoryDto })
  @ApiResponse({ status: 201, type: TrustScoreHistoryResponseDto, description: 'Trust score history entry created successfully' })
  async create(@Body() dto: CreateTrustScoreHistoryDto) {
    return this.trustScoreHistoryService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all trust score history entries with optional filters' })
  @ApiQuery({ name: 'userId', required: false, example: 'user-id-123' })
  @ApiQuery({ name: 'loanId', required: false, example: 'loan-id-123' })
  @ApiQuery({ name: 'reason', required: false, example: 'LOAN_REPAID_ON_TIME' })
  @ApiQuery({ name: 'startDate', required: false, example: '2026-01-01T00:00:00.000Z' })
  @ApiQuery({ name: 'endDate', required: false, example: '2026-12-31T23:59:59.999Z' })
  @ApiResponse({ status: 200, type: [TrustScoreHistoryResponseDto], description: 'List of trust score history entries' })
  async findAll(@Query() query: QueryTrustScoreHistoryDto) {
    return this.trustScoreHistoryService.findAll(query);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get trust score history for a specific user' })
  @ApiParam({ name: 'userId', example: 'user-id-123' })
  @ApiResponse({ status: 200, type: [TrustScoreHistoryResponseDto], description: 'User trust score history' })
  async findByUserId(@Param('userId') userId: string) {
    return this.trustScoreHistoryService.findByUserId(userId);
  }

  @Get('user/:userId/timeline')
  @ApiOperation({ summary: 'Get complete trust score timeline for a user including current score' })
  @ApiParam({ name: 'userId', example: 'user-id-123' })
  @ApiResponse({ 
    status: 200, 
    description: 'Complete user trust score timeline with current score and category',
    schema: {
      example: {
        user: {
          id: 'user-id-123',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          trustScore: 65,
          category: 'GOOD'
        },
        currentScore: 65,
        currentCategory: 'GOOD',
        historyCount: 5,
        history: [
          {
            id: 'history-id-1',
            oldScore: 60,
            newScore: 65,
            change: 5,
            reason: 'LOAN_REPAID_ON_TIME',
            metadata: { lateDays: 0, amount: 1000 },
            createdAt: '2026-01-07T12:00:00.000Z',
            loan: {
              id: 'loan-id-123',
              loanNumber: 'LN-2026-0001',
              amount: 1000,
              status: 'REPAID'
            }
          }
        ]
      }
    }
  })
  async getUserTimeline(@Param('userId') userId: string) {
    return this.trustScoreHistoryService.getUserScoreTimeline(userId);
  }

  @Get('loan/:loanId')
  @ApiOperation({ summary: 'Get trust score history for a specific loan' })
  @ApiParam({ name: 'loanId', example: 'loan-id-123' })
  @ApiResponse({ status: 200, type: [TrustScoreHistoryResponseDto], description: 'Loan-related trust score history' })
  async findByLoanId(@Param('loanId') loanId: string) {
    return this.trustScoreHistoryService.findByLoanId(loanId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get trust score history entry by ID' })
  @ApiParam({ name: 'id', example: 'history-id-123' })
  @ApiResponse({ status: 200, type: TrustScoreHistoryResponseDto, description: 'Trust score history entry details' })
  @ApiResponse({ status: 404, description: 'Trust score history entry not found' })
  async findOne(@Param('id') id: string) {
    return this.trustScoreHistoryService.findOne(id);
  }
}
