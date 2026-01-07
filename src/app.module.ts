import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { LoanModule } from './loan/loan.module';
import { LoanRequestModule } from './loan-request/loan-request.module';
import { LoanOfferModule } from './loan-offer/loan-offer.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UserModule, LoanModule, LoanRequestModule, LoanOfferModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
