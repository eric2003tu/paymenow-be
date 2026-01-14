export class UserProfileResponseDto {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  maritalStatus: string;
  nationalId: string;
  nationalIdVerified: boolean;
  profilePicture?: string;
  
  // Contact Information
  emailVerified: boolean;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
  
  // Account Status
  role: string;
  status: string;
  category: string;
  trustScore: number;
  
  // Financial Information
  totalBorrowed: number;
  totalLent: number;
  totalRepaid: number;
  currentDebt: number;
  walletBalance: number;
  
  // Statistics
  totalLoansTaken: number;
  totalLoansGiven: number;
  loansPaidOnTime: number;
  loansPaidLate: number;
  loansDefaulted: number;
  avgRepaymentTime?: number;
  
  
  // Trust score timeline (latest first)
  trustScoreHistory?: Array<{
    id: string;
    oldScore: number;
    newScore: number;
    change: number;
    reason: string;
    metadata?: any;
    createdAt: Date;
    loan?: {
      id: string;
      loanNumber: string;
      amount: number;
      status: string;
    };
  }>;
  
  // Loan insights
  loansAsBorrower?: Array<{
    id: string;
    loanNumber: string;
    amount: number;
    totalAmount: number;
    amountPaid: number;
    amountDue: number;
    status: string;
    isLate: boolean;
    lateDays: number;
    dueDate?: Date;
    createdAt: Date;
    lender: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      dateOfBirth: Date;
      maritalStatus: string;
      nationalId: string;
      profilePicture?: string;
      trustScore: number;
      category: string;
      address?: {
        street?: string;
        latitude?: number;
        longitude?: number;
        country: {
          id: string;
          name: string;
          code: string;
        };
        province?: {
          id: string;
          name: string;
        };
        district?: {
          id: string;
          name: string;
        };
        sector?: {
          id: string;
          name: string;
        };
        cell?: {
          id: string;
          name: string;
        };
        village?: {
          id: string;
          name: string;
        };
      };
      familyDetails?: {
        spouseName?: string;
        spouseNationalId?: string;
        spousePhone?: string;
        fatherName?: string;
        motherName?: string;
        emergencyContactName?: string;
        emergencyContactPhone?: string;
        emergencyContactRelation?: string;
      };
    };
  }>;
  
  loansAsLender?: Array<{
    id: string;
    loanNumber: string;
    amount: number;
    totalAmount: number;
    amountPaid: number;
    amountDue: number;
    status: string;
    isLate: boolean;
    lateDays: number;
    dueDate?: Date;
    createdAt: Date;
    borrower: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      dateOfBirth: Date;
      maritalStatus: string;
      nationalId: string;
      profilePicture?: string;
      trustScore: number;
      category: string;
      address?: {
        street?: string;
        latitude?: number;
        longitude?: number;
        country: {
          id: string;
          name: string;
          code: string;
        };
        province?: {
          id: string;
          name: string;
        };
        district?: {
          id: string;
          name: string;
        };
        sector?: {
          id: string;
          name: string;
        };
        cell?: {
          id: string;
          name: string;
        };
        village?: {
          id: string;
          name: string;
        };
      };
      familyDetails?: {
        spouseName?: string;
        spouseNationalId?: string;
        spousePhone?: string;
        fatherName?: string;
        motherName?: string;
        emergencyContactName?: string;
        emergencyContactPhone?: string;
        emergencyContactRelation?: string;
      };
    };
  }>;
  
  loanRequests?: Array<{
    id: string;
    loanNumber: string;
    amount: number;
    amountFunded: number;
    amountNeeded: number;
    status: string;
    expiresAt?: Date;
    createdAt: Date;
    loanOffers?: Array<{
      id: string;
      amount: number;
      interestRate: number;
      status: string;
      createdAt: Date;
      lender: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        dateOfBirth: Date;
        maritalStatus: string;
        nationalId: string;
        profilePicture?: string;
        trustScore: number;
        category: string;
        address?: {
          street?: string;
          latitude?: number;
          longitude?: number;
          country: {
            id: string;
            name: string;
            code: string;
          };
          province?: {
            id: string;
            name: string;
          };
          district?: {
            id: string;
            name: string;
          };
          sector?: {
            id: string;
            name: string;
          };
          cell?: {
            id: string;
            name: string;
          };
          village?: {
            id: string;
            name: string;
          };
        };
        familyDetails?: {
          spouseName?: string;
          spouseNationalId?: string;
          spousePhone?: string;
          fatherName?: string;
          motherName?: string;
          emergencyContactName?: string;
          emergencyContactPhone?: string;
          emergencyContactRelation?: string;
        };
      };
    }>;
  }>;
  
  loanOffers?: Array<{
    id: string;
    amount: number;
    interestRate: number;
    status: string;
    createdAt: Date;
    loanRequest: {
      id: string;
      loanNumber: string;
      amount: number;
      status: string;
      borrower: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        dateOfBirth: Date;
        maritalStatus: string;
        nationalId: string;
        profilePicture?: string;
        trustScore: number;
        category: string;
        address?: {
          street?: string;
          latitude?: number;
          longitude?: number;
          country: {
            id: string;
            name: string;
            code: string;
          };
          province?: {
            id: string;
            name: string;
          };
          district?: {
            id: string;
            name: string;
          };
          sector?: {
            id: string;
            name: string;
          };
          cell?: {
            id: string;
            name: string;
          };
          village?: {
            id: string;
            name: string;
          };
        };
        familyDetails?: {
          spouseName?: string;
          spouseNationalId?: string;
          spousePhone?: string;
          fatherName?: string;
          motherName?: string;
          emergencyContactName?: string;
          emergencyContactPhone?: string;
          emergencyContactRelation?: string;
        };
      };
    };
  }>;
  // Address
  address?: {
    id: string;
    street: string;
    countryId: string;
    countryName?: string;
    provinceId?: string;
    provinceName?: string;
    districtId?: string;
    districtName?: string;
    sectorId?: string;
    sectorName?: string;
    cellId?: string;
    cellName?: string;
    villageId?: string;
    villageName?: string;
    latitude?: number;
    longitude?: number;
  };
  
  // Family Details
  familyDetails?: {
    id: string;
    spouseName?: string;
    spousePhone?: string;
    spouseNationalId?: string;
    fatherName?: string;
    motherName?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    emergencyContactRelation?: string;
  };
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}
