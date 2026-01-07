import { Module } from '@nestjs/common';
import { LoanOfferService } from './loan-offer.service';
import { LoanOfferController } from './loan-offer.controller';
import { PrismaModule } from '../prisma.module';
import { NotificationModule } from '../notification/notification.module';
import { AdminGuard } from '../common/admin.guard';

@Module({
  imports: [PrismaModule, NotificationModule],
  controllers: [LoanOfferController],
  providers: [LoanOfferService, AdminGuard],
})
export class LoanOfferModule {}