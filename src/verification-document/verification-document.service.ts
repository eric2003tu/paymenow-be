import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { VerificationStatus, DocumentType, NotificationType, UserStatus } from '@prisma/client';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class VerificationDocumentService {
  constructor(private readonly prisma: PrismaService, private readonly notifications: NotificationService) {}

  async listDocuments(status?: VerificationStatus) {
    return this.prisma.verificationDocument.findMany({
      where: status ? { status } : {},
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            nationalIdVerified: true,
          },
        },
      },
    });
  }

  async approve(id: string, adminId: string, note?: string) {
    const doc = await this.prisma.verificationDocument.findUnique({ where: { id } });
    if (!doc) throw new NotFoundException('Verification document not found');

    const updated = await this.prisma.verificationDocument.update({
      where: { id },
      data: { status: 'VERIFIED', verifiedBy: adminId, verifiedAt: new Date() },
    });

    // Map certain document types to user flags
    if (doc.userId && doc.documentType === DocumentType.NATIONAL_ID) {
      await this.prisma.user.update({
        where: { id: doc.userId },
        data: {
          nationalIdVerified: true,
          status: UserStatus.ACTIVE,
          emailVerified: true,
          phoneVerified: true,
        },
      });
    } else if (doc.userId && doc.documentType === DocumentType.PASSPORT) {
      await this.prisma.user.update({ where: { id: doc.userId }, data: { nationalIdVerified: true } });
    }

    // Send notification to user
    await this.notifications.createNotification(
      doc.userId,
      NotificationType.VERIFICATION_STATUS,
      'Verification Approved',
      `Your ${doc.documentType} document has been verified${note ? `: ${note}` : '.'}`,
      { documentType: doc.documentType, documentId: doc.id, status: 'VERIFIED' },
    );

    return updated;
  }

  async reject(id: string, adminId: string, reason?: string) {
    const doc = await this.prisma.verificationDocument.findUnique({ where: { id } });
    if (!doc) throw new NotFoundException('Verification document not found');

    const updated = await this.prisma.verificationDocument.update({
      where: { id },
      data: { status: 'REJECTED', verifiedBy: adminId, verifiedAt: new Date() },
    });

    await this.notifications.createNotification(
      doc.userId,
      NotificationType.VERIFICATION_STATUS,
      'Verification Rejected',
      `Your ${doc.documentType} document was rejected${reason ? `: ${reason}` : '.'}`,
      { documentType: doc.documentType, documentId: doc.id, status: 'REJECTED' },
    );

    return updated;
  }
}
