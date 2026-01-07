import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Administrative divisions seeding skipped (already seeded)
/*
async function seedDistricts(province: any) {
  const districtsData: Record<string, { name: string; code: string; sectors: string[] }[]> = {
    // 'Kigali': [
    //   { name: 'Nyarugenge', code: '0101', sectors: ['Kanyinya', 'Kigali', 'Kimisagara', 'Mageragere', 'Gahanga', 'Gatenga', 'Gikondo', 'Kagarama', 'Kanombe', 'Kicukiro', 'Kigarama', 'Masaka', 'Niboye', 'Nyarugunga'] },
    //   { name: 'Gasabo', code: '0102', sectors: ['Bumbogo', 'Gatsata', 'Gikomero', 'Gisozi', 'Jabana', 'Jali', 'Kacyiru', 'Kimihurura', 'Kimironko', 'Kinyinya', 'Ndera', 'Nduba', 'Remera', 'Rusororo', 'Rutunga'] },
    //   { name: 'Kicukiro', code: '0103', sectors: ['Gahanga', 'Gatenga', 'Gikondo', 'Kagarama', 'Kanombe', 'Kicukiro', 'Kigarama', 'Masaka', 'Niboye', 'Nyarugunga'] },
    // ],
    'Southern Province': [
      // { name: 'Nyanza', code: '0201', sectors: ['Busasamana', 'Busoro', 'Cyabakamyi', 'Kibilizi', 'Kigoma', 'Mukingo', 'Muyira', 'Ntyazo', 'Nyagisozi', 'Rwabicuma'] },
      // { name: 'Gisagara', code: '0202', sectors: ['Gikonko', 'Gishubi', 'Kansi', 'Kibirizi', 'Kigembe', 'Mamba', 'Muganza', 'Mugombwa', 'Mukindo', 'Musha', 'Ndora', 'Nyanza', 'Save'] },
      // { name: 'Nyaruguru', code: '0203', sectors: ['Buruhukiro', 'Cyanika', 'Gasaka', 'Gatare', 'Kaduha', 'Kamegeri', 'Kibirizi', 'Kibumbwe', 'Kitabi', 'Mbazi', 'Mugano', 'Musange', 'Musebeya', 'Mushubi', 'Nkomane', 'Tare', 'Uwinkingi'] },
      // { name: 'Huye', code: '0204', sectors: ['Gishamvu', 'Huye', 'Karama', 'Kigoma', 'Kinazi', 'Maraba', 'Mbazi', 'Mukura', 'Ngoma', 'Ruhashya', 'Rusatira', 'Rwaniro', 'Simbi', 'Tumba'] },
      // { name: 'Nyamagabe', code: '0205', sectors: ['Buruhukiro', 'Cyanika', 'Gatare', 'Kaduha', 'Kamegeri', 'Kibirizi', 'Kibumbwe', 'Kitabi', 'Mbazi', 'Mugano', 'Musange', 'Musebeya', 'Mushubi', 'Nkomane', 'Tare', 'Uwinkingi'] },
      // { name: 'Ruhango', code: '0206', sectors: ['Bweramana', 'Byimana', 'Kabagali', 'Kinazi', 'Kinihira', 'Mbuye', 'Mwendo', 'Ntongwe', 'Ruhango'] },
      { name: 'Muhanga', code: '0207', sectors: ['Cyeza', 'Kabacuzi', 'Kibangu', 'Kiyumba', 'Muhanga', 'Mushishiro', 'Nyabinoni', 'Nyamabuye', 'Nyarusange', 'Rongi', 'Rugendabari', 'Shyogwe'] },
      { name: 'Kamonyi', code: '0208', sectors: ['Gacurabwenge', 'Karama', 'Kayenzi', 'Kayumbu', 'Mugina', 'Musambira', 'Ngamba', 'Nyamiyaga', 'Nyarubaka', 'Rugarika', 'Rukoma', 'Runda'] },
    ],
    'Western Province': [
      { name: 'Karongi', code: '0301', sectors: ['Bwishyura', 'Gashari', 'Gishyita', 'Gitesi', 'Mubuga', 'Murambi', 'Murundi', 'Mutuntu', 'Rubengera', 'Rugabano', 'Ruganda', 'Rwankuba', 'Twumba'] },
      { name: 'Rutsiro', code: '0302', sectors: ['Boneza', 'Gihango', 'Kigeyo', 'Kivumu', 'Manihira', 'Mukura', 'Murunda', 'Musasa', 'Mushonyi', 'Mushubati', 'Nyabirasi', 'Ruhango', 'Rusebeya'] },
      { name: 'Rubavu', code: '0303', sectors: ['Bugeshi', 'Busasamana', 'Cyanzarwe', 'Gisenyi', 'Kanama', 'Kanzenze', 'Mudende', 'Nyakiriba', 'Nyamyumba', 'Nyundo', 'Rubavu', 'Rugerero'] },
      { name: 'Nyabihu', code: '0304', sectors: ['Bigogwe', 'Jenda', 'Jomba', 'Kabatwa', 'Karago', 'Kintobo', 'Mukamira', 'Muringa', 'Rambura', 'Rugera', 'Rurembo', 'Shyira'] },
      { name: 'Ngororero', code: '0305', sectors: ['Bwira', 'Gatumba', 'Hindiro', 'Kabaya', 'Kageyo', 'Kavumu', 'Matyazo', 'Muhanda', 'Muhororo', 'Ndaro', 'Ngororero', 'Nyange', 'Sovu'] },
      { name: 'Rusizi', code: '0306', sectors: ['Bugarama', 'Butare', 'Bweyeye', 'Gashonga', 'Giheke', 'Gihundwe', 'Gikundamvura', 'Gitambi', 'Kamembe', 'Muganza', 'Mururu', 'Nkanka', 'Nkombo', 'Nkungu', 'Nyakabuye', 'Nyakarenzo', 'Nzahaha', 'Rwimbogo'] },
      { name: 'Nyamasheke', code: '0307', sectors: ['Bushenge', 'Cyato', 'Gihombo', 'Kagano', 'Kanjongo', 'Karambi', 'Karengera', 'Kirimbi', 'Macuba', 'Mahembe', 'Nyabitekeri', 'Rangiro', 'Ruharambuga', 'Shangi'] },
    ],
    'Northern Province': [
      { name: 'Rulindo', code: '0401', sectors: ['Base', 'Burega', 'Bushoki', 'Buyoga', 'Cyinzuzi', 'Cyungo', 'Kinihira', 'Kisaro', 'Masoro', 'Mbogo', 'Murambi', 'Ngoma', 'Nkotsi', 'Rukozo', 'Rusiga', 'Shyorongi', 'Tumba'] },
      { name: 'Gakenke', code: '0402', sectors: ['Busengo', 'Coko', 'Cyabingo', 'Gakenke', 'Gashenyi', 'Janja', 'Kamubuga', 'Karambo', 'Kivuruga', 'Mataba', 'Minazi', 'Mugunga', 'Muhondo', 'Muyongwe', 'Muzo', 'Nemba', 'Ruli', 'Rusasa', 'Rushashi'] },
      { name: 'Musanze', code: '0403', sectors: ['Busogo', 'Cyuve', 'Gacaca', 'Gashaki', 'Gataraga', 'Kimonyi', 'Kinigi', 'Muhoza', 'Muko', 'Musanze', 'Nkotsi', 'Nyange', 'Remera', 'Rwaza', 'Shingiro'] },
      { name: 'Burera', code: '0404', sectors: ['Bungwe', 'Butaro', 'Cyanika', 'Cyeru', 'Gahunga', 'Gatebe', 'Gitovu', 'Kagogo', 'Kinoni', 'Kinyababa', 'Kivuye', 'Nemba', 'Rugarama', 'Rugengabari', 'Ruhunde', 'Rusarabuge', 'Rwerere'] },
      { name: 'Gicumbi', code: '0405', sectors: ['Bukure', 'Bwisige', 'Byumba', 'Cyumba', 'Giti', 'Kageyo', 'Kaniga', 'Manyagiro', 'Miyove', 'Mukarange', 'Muko', 'Mutete', 'Nyamiyaga', 'Nyankenke', 'Rubaya', 'Rukomo', 'Rushaki', 'Rutare', 'Ruvune', 'Rwamiko', 'Shangasha'] },
    ],
    'Eastern Province': [
      { name: 'Rwamagana', code: '0501', sectors: ['Fumbwe', 'Gahengeri', 'Gishali', 'Karenge', 'Kigabiro', 'Muhazi', 'Munyaga', 'Munyiginya', 'Musha', 'Muyumbu', 'Mwulire', 'Nyakaliro', 'Nzige', 'Rubona'] },
      { name: 'Nyagatare', code: '0502', sectors: ['Gatunda', 'Kiyombe', 'Karama', 'Karango', 'Katabagemu', 'Kimate', 'Mimuri', 'Mukama', 'Musheri', 'Nyagatare', 'Rukomo', 'Rwempasha', 'Rwimiyaga', 'Tabagwe'] },
      { name: 'Gatsibo', code: '0503', sectors: ['Gatsibo', 'Gasange', 'Gatsibo', 'Gitoki', 'Kabarore', 'Kageyo', 'Kiramuruzi', 'Kiziguro', 'Muhura', 'Murambi', 'Ngarama', 'Nyagihanga', 'Remera', 'Rugarama', 'Rwimbogo'] },
      { name: 'Kayonza', code: '0504', sectors: ['Gahara', 'Kabare', 'Kabarondo', 'Mukarange', 'Murama', 'Murundi', 'Mwiri', 'Ndego', 'Nyamirama', 'Rukara', 'Ruramira', 'Rwinkwavu'] },
      { name: 'Kirehe', code: '0505', sectors: ['Gahara', 'Kabarondo', 'Kirehe', 'Mahama', 'Mpanga', 'Musaza', 'Mushikiri', 'Nasho', 'Nyamugari', 'Nyarubuye', 'Rwinkwavu'] },
      { name: 'Ngoma', code: '0506', sectors: ['Gashanda', 'Jarama', 'Karembo', 'Kazo', 'Kibungo', 'Mugesera', 'Murama', 'Mutenderi', 'Remera', 'Rukira', 'Rukumberi', 'Rurenge', 'Sake', 'Zaza'] },
      { name: 'Bugesera', code: '0507', sectors: ['Gashora', 'Juru', 'Kamabuye', 'Mareba', 'Mayange', 'Musenyi', 'Mwogo', 'Ngeruka', 'Ntarama', 'Nyamata', 'Nyarugenge', 'Rilima', 'Ruhuha', 'Rweru', 'Shyara'] },
    ],
  };

  const provinceDistricts = districtsData[province.name] || [];
  
  for (const districtData of provinceDistricts) {
    const district = await prisma.district.upsert({
      where: { 
        provinceId_name: { 
          provinceId: province.id, 
          name: districtData.name 
        } 
      },
      update: {},
      create: {
        name: districtData.name,
        code: districtData.code,
        provinceId: province.id,
        isActive: true,
      },
    });

    console.log(`  ✅ Created district: ${district.name}`);

    // Seed sectors for this district
    await seedSectors(district, districtData.sectors);
  }
}

async function seedSectors(district: any, sectorNames: string[]) {
  for (let i = 0; i < sectorNames.length; i++) {
    const sectorName = sectorNames[i];
    const sectorCode = `${district.code}${(i + 1).toString().padStart(2, '0')}`;
    
    const sector = await prisma.sector.upsert({
      where: { 
        districtId_name: { 
          districtId: district.id, 
          name: sectorName 
        } 
      },
      update: {},
      create: {
        name: sectorName,
        code: sectorCode,
        districtId: district.id,
        isActive: true,
      },
    });

    console.log(`    ✅ Created sector: ${sector.name}`);

    // Seed cells for this sector (typically 3-5 cells per sector)
    const cellCount = 3 + Math.floor(Math.random() * 3); // 3-5 cells
    await seedCells(sector, cellCount);
  }
}

async function seedCells(sector: any, cellCount: number) {
  for (let i = 0; i < cellCount; i++) {
    const cellNumber = i + 1;
    const cellName = `Cell ${cellNumber}`;
    const cellCode = `${sector.code}${cellNumber.toString().padStart(2, '0')}`;
    
    const cell = await prisma.cell.upsert({
      where: { 
        sectorId_name: { 
          sectorId: sector.id, 
          name: cellName 
        } 
      },
      update: {},
      create: {
        name: cellName,
        code: cellCode,
        sectorId: sector.id,
        isActive: true,
      },
    });

    // Seed villages for this cell (typically 3-10 villages per cell)
    const villageCount = 3 + Math.floor(Math.random() * 8); // 3-10 villages
    await seedVillages(cell, villageCount);
  }
}

// Administrative divisions seeding functions commented out (already seeded)
/*
async function seedCells(sector: any, cellCount: number) {
  for (let i = 0; i < cellCount; i++) {
    const cellNumber = i + 1;
    const cellName = `Cell ${cellNumber}`;
    const cellCode = `${sector.code}${cellNumber.toString().padStart(2, '0')}`;
    
    const cell = await prisma.cell.upsert({
      where: { 
        sectorId_name: { 
          sectorId: sector.id, 
          name: cellName 
        } 
      },
      update: {},
      create: {
        name: cellName,
        code: cellCode,
        sectorId: sector.id,
        isActive: true,
      },
    });

    // Seed villages for this cell (typically 3-10 villages per cell)
    const villageCount = 3 + Math.floor(Math.random() * 8); // 3-10 villages
    await seedVillages(cell, villageCount);
  }
}

async function seedVillages(cell: any, villageCount: number) {
  for (let i = 0; i < villageCount; i++) {
    const villageNumber = i + 1;
    const villageName = `Village ${villageNumber}`;
    const villageCode = `${cell.code}${villageNumber.toString().padStart(2, '0')}`;
    
    await prisma.village.upsert({
      where: { 
        cellId_name: { 
          cellId: cell.id, 
          name: villageName 
        } 
      },
      update: {},
      create: {
        name: villageName,
        code: villageCode,
        cellId: cell.id,
        isActive: true,
      },
    });
  }
}
*/

// ==================== SEED USERS ====================
async function seedUsers() {
  console.log('👥 Seeding users with full details...');

  // Get Kigali location for users (using 'Kigali' province as defined in the seed)
  const kigaliProvince = await prisma.province.findFirst({
    where: { name: 'Kigali' },
  });

  const kigaliDistrict = kigaliProvince
    ? await prisma.district.findFirst({
        where: { provinceId: kigaliProvince.id },
      })
    : null;

  const kigaliSector = kigaliDistrict
    ? await prisma.sector.findFirst({
        where: { districtId: kigaliDistrict.id },
      })
    : null;

  const kigaliCell = kigaliSector
    ? await prisma.cell.findFirst({
        where: { sectorId: kigaliSector.id },
      })
    : null;

  const kigaliVillage = kigaliCell
    ? await prisma.village.findFirst({
        where: { cellId: kigaliCell.id },
      })
    : null;

  const rwanda2 = await prisma.country.findUnique({
    where: { code: 'RW' },
  });

  // Admin User
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@paymenow.com' },
    update: {},
    create: {
      email: 'admin@paymenow.com',
      phone: '+250788123456',
      password: '$2b$10$G0TgHjedHXmWviVoWdI7lOR9HxgDsKD5L./2OdHYGP/r5en9VLb9a', // hashed 'admin123'
      role: 'ADMIN',
      status: 'ACTIVE',
      firstName: 'John',
      lastName: 'Admin',
      dateOfBirth: new Date('1985-01-15'),
      maritalStatus: 'MARRIED',
      nationalId: 'ADMIN001',
      nationalIdVerified: true,
      emailVerified: true,
      phoneVerified: true,
      trustScore: 100,
      category: 'EXCELLENT',
      totalBorrowed: 0,
      totalLent: 0,
      totalRepaid: 0,
      currentDebt: 0,
      walletBalance: 50000,
      totalLoansTaken: 0,
      totalLoansGiven: 0,
      loansPaidOnTime: 0,
      loansPaidLate: 0,
      loansDefaulted: 0,
      address: {
        create: {
          street: 'Kigali Main Street',
          countryId: rwanda2?.id || 'RW',
          provinceId: kigaliProvince?.id,
          districtId: kigaliDistrict?.id,
          sectorId: kigaliSector?.id,
          cellId: kigaliCell?.id,
          villageId: kigaliVillage?.id,
          latitude: -1.949536,
          longitude: 29.873888,
        },
      },
      familyDetails: {
        create: {
          spouseName: 'Jane Admin',
          spousePhone: '+250788654321',
          fatherName: 'Joseph Admin',
          motherName: 'Mary Admin',
          emergencyContactName: 'Jane Admin',
          emergencyContactPhone: '+250788654321',
          emergencyContactRelation: 'Spouse',
        },
      },
    },
  });

  console.log('✅ Admin user created:', adminUser.email);

  // Lender User
  const lenderUser = await prisma.user.upsert({
    where: { email: 'lender@paymenow.com' },
    update: {},
    create: {
      email: 'lender@paymenow.com',
      phone: '+250788234567',
      password: '$2b$10$ce0g/giiylY0m2pwp1B8POOzAGsCNe2fyuWltofXhCmFk.CsEVFS.', // hashed 'lender123'
      role: 'USER',
      status: 'ACTIVE',
      firstName: 'Alice',
      lastName: 'Lender',
      dateOfBirth: new Date('1990-05-20'),
      maritalStatus: 'SINGLE',
      nationalId: 'LENDER001',
      nationalIdVerified: true,
      emailVerified: true,
      phoneVerified: true,
      trustScore: 85,
      category: 'EXCELLENT',
      totalBorrowed: 0,
      totalLent: 500000,
      totalRepaid: 0,
      currentDebt: 0,
      walletBalance: 250000,
      totalLoansTaken: 0,
      totalLoansGiven: 15,
      loansPaidOnTime: 0,
      loansPaidLate: 0,
      loansDefaulted: 0,
      address: {
        create: {
          street: 'Nyarutarama Street',
          countryId: rwanda2?.id || 'RW',
          provinceId: kigaliProvince?.id,
          districtId: kigaliDistrict?.id,
          sectorId: kigaliSector?.id,
          cellId: kigaliCell?.id,
          villageId: kigaliVillage?.id,
          latitude: -1.945,
          longitude: 29.879,
        },
      },
      familyDetails: {
        create: {
          spouseName: null,
          fatherName: 'Robert Lender',
          motherName: 'Susan Lender',
          emergencyContactName: 'Robert Lender',
          emergencyContactPhone: '+250788111111',
          emergencyContactRelation: 'Father',
        },
      },
    },
  });

  console.log('✅ Lender user created:', lenderUser.email);

  // Borrower 1
  const borrower1 = await prisma.user.upsert({
    where: { email: 'borrower1@paymenow.com' },
    update: {},
    create: {
      email: 'borrower1@paymenow.com',
      phone: '+250788345678',
      password: '$2b$10$HEM4s12049C.D4EwTRpgiuM7QoAehCOy94IBuwbYKPCEKQ.09SpjW', // hashed 'borrower123'
      role: 'USER',
      status: 'ACTIVE',
      firstName: 'Peter',
      lastName: 'Borrower',
      dateOfBirth: new Date('1988-03-10'),
      maritalStatus: 'MARRIED',
      nationalId: 'BORROW001',
      nationalIdVerified: true,
      emailVerified: true,
      phoneVerified: true,
      trustScore: 70,
      category: 'GOOD',
      totalBorrowed: 200000,
      totalLent: 0,
      totalRepaid: 180000,
      currentDebt: 20000,
      walletBalance: 15000,
      totalLoansTaken: 8,
      totalLoansGiven: 0,
      loansPaidOnTime: 7,
      loansPaidLate: 1,
      loansDefaulted: 0,
      avgRepaymentTime: 2,
      address: {
        create: {
          street: 'Gacuriro Avenue',
          countryId: rwanda2?.id || 'RW',
          provinceId: kigaliProvince?.id,
          districtId: kigaliDistrict?.id,
          sectorId: kigaliSector?.id,
          cellId: kigaliCell?.id,
          villageId: kigaliVillage?.id,
          latitude: -1.952,
          longitude: 29.876,
        },
      },
      familyDetails: {
        create: {
          spouseName: 'Maria Borrower',
          spousePhone: '+250788222222',
          spouseNationalId: 'BORROW001S',
          fatherName: 'David Borrower',
          motherName: 'Helen Borrower',
          emergencyContactName: 'Maria Borrower',
          emergencyContactPhone: '+250788222222',
          emergencyContactRelation: 'Spouse',
        },
      },
    },
  });

  console.log('✅ Borrower 1 created:', borrower1.email);

  // Borrower 2
  const borrower2 = await prisma.user.upsert({
    where: { email: 'borrower2@paymenow.com' },
    update: {},
    create: {
      email: 'borrower2@paymenow.com',
      phone: '+250788456789',
      password: '$2b$10$HEM4s12049C.D4EwTRpgiuM7QoAehCOy94IBuwbYKPCEKQ.09SpjW', // hashed 'borrower123'
      role: 'USER',
      status: 'ACTIVE',
      firstName: 'Grace',
      lastName: 'Mukamana',
      dateOfBirth: new Date('1992-07-22'),
      maritalStatus: 'DIVORCED',
      nationalId: 'BORROW002',
      nationalIdVerified: true,
      emailVerified: true,
      phoneVerified: true,
      trustScore: 55,
      category: 'TRUSTABLE',
      totalBorrowed: 150000,
      totalLent: 0,
      totalRepaid: 145000,
      currentDebt: 5000,
      walletBalance: 8000,
      totalLoansTaken: 5,
      totalLoansGiven: 0,
      loansPaidOnTime: 5,
      loansPaidLate: 0,
      loansDefaulted: 0,
      avgRepaymentTime: 0,
      address: {
        create: {
          street: 'Kacyiru Road',
          countryId: rwanda2?.id || 'RW',
          provinceId: kigaliProvince?.id,
          districtId: kigaliDistrict?.id,
          sectorId: kigaliSector?.id,
          cellId: kigaliCell?.id,
          villageId: kigaliVillage?.id,
          latitude: -1.948,
          longitude: 29.875,
        },
      },
      familyDetails: {
        create: {
          spouseName: null,
          fatherName: 'Samuel Mukamana',
          motherName: 'Patricia Mukamana',
          emergencyContactName: 'Samuel Mukamana',
          emergencyContactPhone: '+250788333333',
          emergencyContactRelation: 'Father',
        },
      },
    },
  });

  console.log('✅ Borrower 2 created:', borrower2.email);

  // Borrower 3 with risky history
  const borrower3 = await prisma.user.upsert({
    where: { email: 'borrower3@paymenow.com' },
    update: {},
    create: {
      email: 'borrower3@paymenow.com',
      phone: '+250788567890',
      password: '$2b$10$HEM4s12049C.D4EwTRpgiuM7QoAehCOy94IBuwbYKPCEKQ.09SpjW', // hashed 'borrower123'
      role: 'USER',
      status: 'ACTIVE',
      firstName: 'Martin',
      lastName: 'Habimana',
      dateOfBirth: new Date('1987-11-05'),
      maritalStatus: 'MARRIED',
      nationalId: 'BORROW003',
      nationalIdVerified: true,
      emailVerified: true,
      phoneVerified: true,
      trustScore: 30,
      category: 'RISKY',
      totalBorrowed: 500000,
      totalLent: 0,
      totalRepaid: 450000,
      currentDebt: 50000,
      walletBalance: 5000,
      totalLoansTaken: 12,
      totalLoansGiven: 0,
      loansPaidOnTime: 9,
      loansPaidLate: 3,
      loansDefaulted: 0,
      avgRepaymentTime: 8,
      address: {
        create: {
          street: 'Kimihurura Street',
          countryId: rwanda2?.id || 'RW',
          provinceId: kigaliProvince?.id,
          districtId: kigaliDistrict?.id,
          sectorId: kigaliSector?.id,
          cellId: kigaliCell?.id,
          villageId: kigaliVillage?.id,
          latitude: -1.944,
          longitude: 29.882,
        },
      },
      familyDetails: {
        create: {
          spouseName: 'Therese Habimana',
          spousePhone: '+250788444444',
          fatherName: 'Jean Habimana',
          motherName: 'Beatrice Habimana',
          emergencyContactName: 'Therese Habimana',
          emergencyContactPhone: '+250788444444',
          emergencyContactRelation: 'Spouse',
        },
      },
    },
  });

  console.log('✅ Borrower 3 created:', borrower3.email);

  console.log('\n✅ All users seeded successfully!');
}

async function main() {
  try {
    // Create Rwanda country if it doesn't exist
    await prisma.country.upsert({
      where: { code: 'RW' },
      update: {},
      create: {
        name: 'Rwanda',
        code: 'RW',
        currency: 'RWF',
        phonePrefix: '+250',
        isActive: true,
      },
    });

    // Create platform settings if it doesn't exist
    await prisma.platformSettings.upsert({
      where: { id: 'platform-settings-001' },
      update: {},
      create: {
        id: 'platform-settings-001',
        platformFeePercentage: 1.0,
        maxLoanAmount: 1000000,
        minLoanAmount: 1000,
        lateFeePercentage: 2.0,
        maxLateDaysBeforeDefault: 30,
        trustScoreWeight: JSON.stringify({
          onTimeRepayments: 40,
          currentDebtRatio: 25,
          loanHistoryLength: 15,
          verificationLevel: 10,
          socialConnections: 10
        }),
        minInterestRate: 1.0,
        maxInterestRate: 20.0,
        minLoanDurationDays: 7,
        maxLoanDurationDays: 365,
        requireGuarantor: false,
        minGuarantors: 0,
        maxGuarantors: 3,
        updatedBy: 'system-seed',
      },
    });

    console.log('✅ Created platform settings');

    // Seed users
    await seedUsers();
  } catch (e) {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });