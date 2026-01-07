import { Module } from '@nestjs/common';
import { LoanController } from './loan.controller';
import { LoanService } from './loan.service';
import { PrismaModule } from '../prisma.module';
import { TrustScoreHistoryModule } from '../trust-score-history/trust-score-history.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [PrismaModule, TrustScoreHistoryModule, NotificationModule],
  controllers: [LoanController],
  providers: [LoanService],
  exports: [LoanService],
})
export class LoanModule {}