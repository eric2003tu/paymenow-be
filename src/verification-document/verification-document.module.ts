import { Module } from '@nestjs/common';
import { VerificationDocumentService } from './verification-document.service';
import { VerificationDocumentController } from './verification-document.controller';
import { PrismaService } from '../prisma.service';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [NotificationModule],
  controllers: [VerificationDocumentController],
  providers: [VerificationDocumentService, PrismaService],
})
export class VerificationDocumentModule {}
