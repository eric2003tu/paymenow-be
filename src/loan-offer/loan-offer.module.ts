import { Module } from '@nestjs/common';
import { LoanOfferService } from './loan-offer.service';
import { LoanOfferController } from './loan-offer.controller';
import { PrismaModule } from '../prisma.module';  // Add this
import { AdminGuard } from '../common/admin.guard';

@Module({
  imports: [PrismaModule],  // Add this
  controllers: [LoanOfferController],
  providers: [LoanOfferService, AdminGuard],  // Remove PrismaService from here
})
export class LoanOfferModule {}