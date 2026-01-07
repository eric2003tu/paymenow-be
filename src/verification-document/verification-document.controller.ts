import { Controller, Get, Query, UseGuards, Patch, Param, Body, Req } from '@nestjs/common';
import { VerificationDocumentService } from './verification-document.service';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../common/admin.guard';
import { VerificationStatus } from '@prisma/client';

class ReviewDto {
  note?: string;
}

@Controller('verification-docs')
@UseGuards(AuthGuard('jwt'), AdminGuard)
export class VerificationDocumentController {
  constructor(private readonly service: VerificationDocumentService) {}

  @Get()
  async list(@Query('status') status?: VerificationStatus) {
    return this.service.listDocuments(status);
  }

  @Get('pending')
  async listPending() {
    return this.service.listDocuments('PENDING');
  }

  @Patch(':id/approve')
  async approve(@Param('id') id: string, @Body() body: ReviewDto, @Req() req: any) {
    return this.service.approve(id, req.user.sub, body?.note);
  }

  @Patch(':id/reject')
  async reject(@Param('id') id: string, @Body() body: ReviewDto, @Req() req: any) {
    return this.service.reject(id, req.user.sub, body?.note);
  }
}
