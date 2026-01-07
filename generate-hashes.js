const bcrypt = require('bcryptjs');

async function generateHashes() {
  try {
    const passwords = {
      'admin123': await bcrypt.hash('admin123', 10),
      'lender123': await bcrypt.hash('lender123', 10),
      'borrower123': await bcrypt.hash('borrower123', 10),
    };
    
    console.log('Generated bcrypt hashes:');
    console.log('\nadmin123:');
    console.log(passwords.admin123);
    console.log('\nlender123:');
    console.log(passwords.lender123);
    console.log('\nborrower123:');
    console.log(passwords.borrower123);
  } catch (error) {
    console.error('Error generating hashes:', error);
  }
}

generateHashes();
