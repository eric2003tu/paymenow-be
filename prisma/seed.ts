import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌍 Seeding Rwanda administrative divisions...');

  // Create Rwanda
  const rwanda = await prisma.country.upsert({
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

  console.log(`✅ Created country: ${rwanda.name}`);

  // Rwanda's 5 provinces
  const provinces = [
    { name: 'Kigali', code: '01' },
    { name: 'Southern Province', code: '02' },
    { name: 'Western Province', code: '03' },
    { name: 'Northern Province', code: '04' },
    { name: 'Eastern Province', code: '05' },
  ];

  for (const provinceData of provinces) {
    const province = await prisma.province.upsert({
      where: { 
        countryId_name: { 
          countryId: rwanda.id, 
          name: provinceData.name 
        } 
      },
      update: {},
      create: {
        name: provinceData.name,
        code: provinceData.code,
        countryId: rwanda.id,
        isActive: true,
      },
    });

    console.log(`✅ Created province: ${province.name}`);

    // Seed districts for each province
    await seedDistricts(province);
  }

  // Create platform settings
  await prisma.platformSettings.upsert({
    where: { id: 'platform-settings-001' },
    update: {},
    create: {
      id: 'platform-settings-001',
      platformFeePercentage: 1.0,
      maxLoanAmount: 1000000, // 1 million RWF
      minLoanAmount: 1000, // 1k RWF
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

  // Create a test admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@payme.rw' },
    update: {},
    create: {
      email: 'admin@payme.rw',
      phone: '+250788123456',
      password: '$2b$10$YourHashedPasswordHere', // You should hash this properly
      role: 'ADMIN',
      status: 'ACTIVE',
      category: 'EXCELLENT',
      trustScore: 100,
      firstName: 'PayMe',
      lastName: 'Admin',
      dateOfBirth: new Date('1990-01-01'),
      maritalStatus: 'SINGLE',
      nationalId: '1234567890123456',
      nationalIdVerified: true,
      emailVerified: true,
      phoneVerified: true,
      twoFactorEnabled: false,
    },
  });

  console.log(`✅ Created admin user: ${adminUser.email}`);

  console.log('🎉 Seeding completed successfully!');
}

async function seedDistricts(province: any) {
  const districtsData: Record<string, { name: string; code: string; sectors: string[] }[]> = {
    'Kigali': [
      { name: 'Nyarugenge', code: '0101', sectors: ['Kanyinya', 'Kigali', 'Kimisagara', 'Mageragere', 'Gahanga', 'Gatenga', 'Gikondo', 'Kagarama', 'Kanombe', 'Kicukiro', 'Kigarama', 'Masaka', 'Niboye', 'Nyarugunga'] },
      { name: 'Gasabo', code: '0102', sectors: ['Bumbogo', 'Gatsata', 'Gikomero', 'Gisozi', 'Jabana', 'Jali', 'Kacyiru', 'Kimihurura', 'Kimironko', 'Kinyinya', 'Ndera', 'Nduba', 'Remera', 'Rusororo', 'Rutunga'] },
      { name: 'Kicukiro', code: '0103', sectors: ['Gahanga', 'Gatenga', 'Gikondo', 'Kagarama', 'Kanombe', 'Kicukiro', 'Kigarama', 'Masaka', 'Niboye', 'Nyarugunga'] },
    ],
    'Southern Province': [
      { name: 'Nyanza', code: '0201', sectors: ['Busasamana', 'Busoro', 'Cyabakamyi', 'Kibilizi', 'Kigoma', 'Mukingo', 'Muyira', 'Ntyazo', 'Nyagisozi', 'Rwabicuma'] },
      { name: 'Gisagara', code: '0202', sectors: ['Gikonko', 'Gishubi', 'Kansi', 'Kibirizi', 'Kigembe', 'Mamba', 'Muganza', 'Mugombwa', 'Mukindo', 'Musha', 'Ndora', 'Nyanza', 'Save'] },
      { name: 'Nyaruguru', code: '0203', sectors: ['Buruhukiro', 'Cyanika', 'Gasaka', 'Gatare', 'Kaduha', 'Kamegeri', 'Kibirizi', 'Kibumbwe', 'Kitabi', 'Mbazi', 'Mugano', 'Musange', 'Musebeya', 'Mushubi', 'Nkomane', 'Tare', 'Uwinkingi'] },
      { name: 'Huye', code: '0204', sectors: ['Gishamvu', 'Huye', 'Karama', 'Kigoma', 'Kinazi', 'Maraba', 'Mbazi', 'Mukura', 'Ngoma', 'Ruhashya', 'Rusatira', 'Rwaniro', 'Simbi', 'Tumba'] },
      { name: 'Nyamagabe', code: '0205', sectors: ['Buruhukiro', 'Cyanika', 'Gatare', 'Kaduha', 'Kamegeri', 'Kibirizi', 'Kibumbwe', 'Kitabi', 'Mbazi', 'Mugano', 'Musange', 'Musebeya', 'Mushubi', 'Nkomane', 'Tare', 'Uwinkingi'] },
      { name: 'Ruhango', code: '0206', sectors: ['Bweramana', 'Byimana', 'Kabagali', 'Kinazi', 'Kinihira', 'Mbuye', 'Mwendo', 'Ntongwe', 'Ruhango'] },
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

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });