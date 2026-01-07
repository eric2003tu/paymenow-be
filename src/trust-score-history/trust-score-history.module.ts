import { Module } from '@nestjs/common';
import { TrustScoreHistoryController } from './trust-score-history.controller';
import { TrustScoreHistoryService } from './trust-score-history.service';
import { PrismaModule } from '../prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TrustScoreHistoryController],
  providers: [TrustScoreHistoryService],
  exports: [TrustScoreHistoryService],
})
export class TrustScoreHistoryModule {}
