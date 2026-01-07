import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { NotificationType, Notification } from '@prisma/client';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a notification for a user
   */
  async createNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    data?: any,
  ): Promise<Notification> {
    return this.prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        data: data || {},
      },
    });
  }

  /**
   * Get user's unread notifications
   */
  async getUnreadNotifications(userId: string): Promise<Notification[]> {
    return this.prisma.notification.findMany({
      where: {
        userId,
        isRead: false,
        isDeleted: false,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get user's all notifications
   */
  async getAllNotifications(userId: string, limit: number = 20): Promise<Notification[]> {
    return this.prisma.notification.findMany({
      where: {
        userId,
        isDeleted: false,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<Notification> {
    return this.prisma.notification.update({
      where: { id: notificationId },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  /**
   * Mark all user's notifications as read
   */
  async markAllAsRead(userId: string): Promise<{ count: number }> {
    const result = await this.prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
        isDeleted: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
    return { count: result.count };
  }

  /**
   * Delete notification
   */
  async softDeleteNotification(notificationId: string): Promise<Notification> {
    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { isDeleted: true },
    });
  }

  /**
   * Notify borrower when they accepted an offer
   */
  async notifyBorrowerOfferAccepted(borrowerId: string, lenderName: string, amount: number): Promise<Notification> {
    return this.createNotification(
      borrowerId,
      'LOAN_APPROVED',
      'Loan Offer Accepted',
      `You have successfully accepted the loan offer of ${amount} RWF from ${lenderName}. Waiting for lender to sign.`,
      { lenderName, amount },
    );
  }

  /**
   * Notify lender when borrower accepted their offer
   */
  async notifyLenderOfferAccepted(lenderId: string, borrowerName: string, amount: number): Promise<Notification> {
    return this.createNotification(
      lenderId,
      'LOAN_OFFER',
      'Your Offer Accepted',
      `${borrowerName} has accepted your loan offer of ${amount} RWF. Please review and sign to activate the loan.`,
      { borrowerName, amount },
    );
  }

  /**
   * Notify borrower when lender signs the loan
   */
  async notifyBorrowerLoanSigned(borrowerId: string, lenderName: string, amount: number, dueDate: Date): Promise<Notification> {
    const dueDateStr = new Date(dueDate).toLocaleDateString();
    return this.createNotification(
      borrowerId,
      'LOAN_DISBURSED',
      'Loan Activated',
      `${lenderName} has signed the loan agreement. Your loan of ${amount} RWF is now active and due on ${dueDateStr}.`,
      { lenderName, amount, dueDate },
    );
  }

  /**
   * Notify lender when they sign the loan
   */
  async notifyLenderLoanSigned(lenderId: string, borrowerName: string, amount: number, dueDate: Date): Promise<Notification> {
    const dueDateStr = new Date(dueDate).toLocaleDateString();
    return this.createNotification(
      lenderId,
      'LOAN_DISBURSED',
      'Loan Activated',
      `You have signed the loan with ${borrowerName}. The loan of ${amount} RWF is now active and due on ${dueDateStr}.`,
      { borrowerName, amount, dueDate },
    );
  }

  /**
   * Notify both borrower and lender of payment approaching
   */
  async notifyPaymentApproaching(borrowerId: string, lenderId: string, borrowerName: string, lenderName: string, amount: number, daysUntilDue: number): Promise<void> {
    await this.createNotification(
      borrowerId,
      'REPAYMENT_REMINDER',
      'Payment Due Soon',
      `Your loan payment of ${amount} RWF to ${lenderName} is due in ${daysUntilDue} days.`,
      { lenderName, amount, daysUntilDue },
    );

    await this.createNotification(
      lenderId,
      'REPAYMENT_REMINDER',
      'Payment Due Soon',
      `Your loan to ${borrowerName} of ${amount} RWF is due in ${daysUntilDue} days.`,
      { borrowerName, amount, daysUntilDue },
    );
  }

  /**
   * Notify lender when borrower makes payment
   */
  async notifyLenderPaymentReceived(lenderId: string, borrowerName: string, amount: number): Promise<Notification> {
    return this.createNotification(
      lenderId,
      'REPAYMENT_RECEIVED',
      'Payment Received',
      `${borrowerName} has paid ${amount} RWF towards your loan.`,
      { borrowerName, amount },
    );
  }

  /**
   * Notify borrower of payment confirmation
   */
  async notifyBorrowerPaymentConfirmed(borrowerId: string, lenderName: string, amount: number): Promise<Notification> {
    return this.createNotification(
      borrowerId,
      'REPAYMENT_RECEIVED',
      'Payment Confirmed',
      `Your payment of ${amount} RWF to ${lenderName} has been confirmed.`,
      { lenderName, amount },
    );
  }

  /**
   * Notify borrower of loan overdue
   */
  async notifyBorrowerLoanOverdue(borrowerId: string, lenderName: string, amount: number, daysOverdue: number): Promise<Notification> {
    return this.createNotification(
      borrowerId,
      'LOAN_OVERDUE',
      'Loan Payment Overdue',
      `Your loan payment of ${amount} RWF to ${lenderName} is ${daysOverdue} days overdue. Please pay immediately.`,
      { lenderName, amount, daysOverdue },
    );
  }

  /**
   * Notify lender of loan overdue
   */
  async notifyLenderLoanOverdue(lenderId: string, borrowerName: string, amount: number, daysOverdue: number): Promise<Notification> {
    return this.createNotification(
      lenderId,
      'LOAN_OVERDUE',
      'Loan Payment Overdue',
      `The loan to ${borrowerName} of ${amount} RWF is ${daysOverdue} days overdue.`,
      { borrowerName, amount, daysOverdue },
    );
  }

  /**
   * Notify borrower that a lender made an offer on their loan request
   */
  async notifyBorrowerOfOfferCreated(borrowerId: string, lenderName: string, amount: number): Promise<Notification> {
    return this.createNotification(
      borrowerId,
      'LOAN_OFFER',
      'New Loan Offer Received',
      `${lenderName} has offered you ${amount} RWF for your loan request. Review and accept the offer if interested.`,
      { lenderName, amount },
    );
  }

  /**
   * Notify lender that borrower claims to have paid
   */
  async notifyLenderPaymentClaimed(lenderId: string, borrowerName: string, amount: number, loanId: string): Promise<Notification> {
    return this.createNotification(
      lenderId,
      'REPAYMENT_RECEIVED',
      'Payment Confirmation Required',
      `${borrowerName} claims to have paid ${amount} RWF. Please confirm if you received the payment.`,
      { borrowerName, amount, loanId },
    );
  }

  /**
   * Notify borrower that payment was confirmed and loan is complete
   */
  async notifyBorrowerPaymentConfirmedComplete(borrowerId: string, lenderName: string, amount: number): Promise<Notification> {
    return this.createNotification(
      borrowerId,
      'REPAYMENT_RECEIVED',
      'Payment Confirmed - Loan Complete',
      `${lenderName} confirmed receipt of ${amount} RWF. Your loan has been marked as REPAID. Thank you!`,
      { lenderName, amount },
    );
  }
}
