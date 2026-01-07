import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma.module';
import { NotificationModule } from '../notification/notification.module';
import { LoanSchedulerService } from './loan-scheduler.service';

@Module({
  imports: [PrismaModule, NotificationModule],
  providers: [LoanSchedulerService],
})
export class SchedulerModule {}
