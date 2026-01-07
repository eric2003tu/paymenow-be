import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateUserPasswords() {
  try {
    const users = [
      { email: 'admin@paymenow.com', password: '$2b$10$G0TgHjedHXmWviVoWdI7lOR9HxgDsKD5L./2OdHYGP/r5en9VLb9a' },
      { email: 'lender@paymenow.com', password: '$2b$10$ce0g/giiylY0m2pwp1B8POOzAGsCNe2fyuWltofXhCmFk.CsEVFS.' },
      { email: 'borrower1@paymenow.com', password: '$2b$10$HEM4s12049C.D4EwTRpgiuM7QoAehCOy94IBuwbYKPCEKQ.09SpjW' },
      { email: 'borrower2@paymenow.com', password: '$2b$10$HEM4s12049C.D4EwTRpgiuM7QoAehCOy94IBuwbYKPCEKQ.09SpjW' },
      { email: 'borrower3@paymenow.com', password: '$2b$10$HEM4s12049C.D4EwTRpgiuM7QoAehCOy94IBuwbYKPCEKQ.09SpjW' },
    ];

    for (const user of users) {
      await prisma.user.update({
        where: { email: user.email },
        data: { password: user.password },
      });
      console.log(`✅ Updated password for ${user.email}`);
    }

    console.log('\n✅ All passwords updated successfully!');
  } catch (error) {
    console.error('❌ Error updating passwords:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateUserPasswords();
