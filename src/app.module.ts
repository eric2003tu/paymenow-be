import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { LoanModule } from './loan/loan.module';
import { LoanRequestModule } from './loan-request/loan-request.module';
import { LoanOfferModule } from './loan-offer/loan-offer.module';
import { AuthModule } from './auth/auth.module';
import { TrustScoreHistoryModule } from './trust-score-history/trust-score-history.module';
import { NotificationModule } from './notification/notification.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { VerificationDocumentModule } from './verification-document/verification-document.module';
import { AddressModule } from './address/address.module';

@Module({
  imports: [
    UserModule,
    LoanModule,
    LoanRequestModule,
    LoanOfferModule,
    AuthModule,
    TrustScoreHistoryModule,
    NotificationModule,
    SchedulerModule,
    VerificationDocumentModule,
    AddressModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
