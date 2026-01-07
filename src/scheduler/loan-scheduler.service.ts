import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class LoanSchedulerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(LoanSchedulerService.name);
  private timers: NodeJS.Timeout[] = [];

  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationService,
  ) {}

  private toNumber(v: any): number {
    return v && typeof v === 'object' && typeof v.toNumber === 'function' ? v.toNumber() : Number(v);
  }

  async sendRepaymentReminders() {
    const now = new Date();
    const in3 = new Date(now);
    in3.setDate(in3.getDate() + 3);
    const in7 = new Date(now);
    in7.setDate(in7.getDate() + 7);

    try {
      const loans = await this.prisma.loan.findMany({
        where: {
          isDeleted: false,
          status: 'ACTIVE',
          dueDate: { gte: in3, lte: in7 },
        },
        select: {
          id: true,
          amount: true,
          borrowerId: true,
          lenderId: true,
          dueDate: true,
          borrower: { select: { firstName: true, lastName: true } },
          lender: { select: { firstName: true, lastName: true } },
        },
      });

      for (const loan of loans) {
        const amount = this.toNumber(loan.amount);
        const daysUntilDue = Math.max(0, Math.ceil((loan.dueDate!.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
        const borrowerName = `${loan.borrower.firstName} ${loan.borrower.lastName}`;
        const lenderName = `${loan.lender.firstName} ${loan.lender.lastName}`;
        await this.notifications.notifyPaymentApproaching(
          loan.borrowerId,
          loan.lenderId,
          borrowerName,
          lenderName,
          amount,
          daysUntilDue,
        );
      }

      if (loans.length) this.logger.log(`Sent repayment reminders for ${loans.length} loan(s).`);
    } catch (err: any) {
      this.logger.error(`sendRepaymentReminders failed: ${err.message}`);
    }
  }

  async markAndNotifyOverdueLoans() {
    const now = new Date();
    try {
      // Find active loans that are past due
      const overdue = await this.prisma.loan.findMany({
        where: {
          isDeleted: false,
          status: 'ACTIVE',
          dueDate: { lt: now },
        },
        select: {
          id: true,
          amount: true,
          borrowerId: true,
          lenderId: true,
          dueDate: true,
          borrower: { select: { firstName: true, lastName: true } },
          lender: { select: { firstName: true, lastName: true } },
        },
      });

      for (const loan of overdue) {
        const lateDays = Math.max(1, Math.floor((now.getTime() - loan.dueDate!.getTime()) / (1000 * 60 * 60 * 24)));
        const amount = this.toNumber(loan.amount);
        // Mark as OVERDUE if not already
        await this.prisma.loan.update({
          where: { id: loan.id },
          data: {
            status: 'OVERDUE',
            isLate: true,
            lateDays,
          },
        });

        const borrowerName = `${loan.borrower.firstName} ${loan.borrower.lastName}`;
        const lenderName = `${loan.lender.firstName} ${loan.lender.lastName}`;
        await this.notifications.notifyBorrowerLoanOverdue(
          loan.borrowerId,
          lenderName,
          amount,
          lateDays,
        );
        await this.notifications.notifyLenderLoanOverdue(
          loan.lenderId,
          borrowerName,
          amount,
          lateDays,
        );
      }

      if (overdue.length) this.logger.log(`Marked ${overdue.length} loan(s) as OVERDUE and sent notifications.`);
    } catch (err: any) {
      this.logger.error(`markAndNotifyOverdueLoans failed: ${err.message}`);
    }
  }
  private scheduleDailyAt(hour: number, minute: number, task: () => Promise<void>) {
    const scheduleNext = () => {
      const now = new Date();
      const next = new Date(now);
      next.setHours(hour, minute, 0, 0);
      if (next <= now) next.setDate(next.getDate() + 1);
      const delay = next.getTime() - now.getTime();
      const t = setTimeout(async () => {
        try {
          await task();
        } catch (e: any) {
          this.logger.error(e?.message || e);
        } finally {
          // after run, schedule again in 24h
          const t2 = setInterval(() => {
            task().catch(err => this.logger.error(err?.message || err));
          }, 24 * 60 * 60 * 1000);
          this.timers.push(t2);
        }
      }, delay);
      this.timers.push(t);
    };
    scheduleNext();
  }

  onModuleInit() {
    // 09:00 reminders; 09:30 overdue check
    this.scheduleDailyAt(9, 0, () => this.sendRepaymentReminders());
    this.scheduleDailyAt(9, 30, () => this.markAndNotifyOverdueLoans());
    this.logger.log('LoanSchedulerService timers initialized.');
  }

  onModuleDestroy() {
    for (const t of this.timers) clearInterval(t as any);
    this.timers = [];
  }
}
