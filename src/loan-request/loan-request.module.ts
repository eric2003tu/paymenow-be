import { Module } from '@nestjs/common';
import { LoanRequestController } from './loan-request.controller';
import { LoanRequestService } from './loan-request.service';
import { PrismaModule } from '../prisma.module';  // Add this

@Module({
  imports: [PrismaModule],  // Add this
  controllers: [LoanRequestController],
  providers: [LoanRequestService],
  exports: [LoanRequestService],
})
export class LoanRequestModule {}