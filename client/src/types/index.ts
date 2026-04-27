export type UserRole = 'barangay' | 'municipal' | 'provincial' | 'super_admin';

export interface GeoDoc {
  _id: string;
  name: string;
  psgcCode?: string;
}

export interface User {
  id: string;
  username: string;
  fullName?: string;
  email?: string;
  role: UserRole;
  scopeLabel?: string;
  barangay?: GeoDoc | null;
  municipality?: GeoDoc | null;
  province?: GeoDoc | null;
  isActive: boolean;
  lastLogin?: string;
  createdAt?: string;
}

export interface BlotterAddress {
  houseNo?: string;
  street?: string;
  barangay?: string;
  municipality?: string;
  province?: string;
  zipCode?: string;
}

export interface BlotterPerson {
  lastName: string;
  firstName: string;
  middleName?: string;
  suffix?: string;
  alias?: string;
  sex?: string;
  birthDate?: string;
  age?: number;
  civilStatus?: string;
  nationality?: string;
  religion?: string;
  occupation?: string;
  contactNumber?: string;
  address?: BlotterAddress;
  idType?: string;
  idNumber?: string;
  relationshipToComplainant?: string;
  isKnown?: boolean;
}

export interface BlotterWitness {
  lastName?: string;
  firstName?: string;
  middleName?: string;
  contactNumber?: string;
  address?: string;
  statement?: string;
}

export type BlotterStatus = 'draft' | 'recorded' | 'under_mediation' | 'settled' | 'referred_to_pnp' | 'closed';

export interface Blotter {
  _id: string;
  blotterNumber?: string;
  barangay: GeoDoc;
  municipality: GeoDoc;
  province: GeoDoc;
  createdBy: { _id: string; fullName?: string; username: string };
  incident: {
    type: string;
    otherType?: string;
    dateOccurred: string;
    timeOccurred?: string;
    placeOccurred: string;
    narrative: string;
    motive?: string;
    weaponOrObjectUsed?: string;
    isReferred?: boolean;
    referredTo?: string;
    referredDate?: string;
  };
  complainant: BlotterPerson;
  respondents: BlotterPerson[];
  witnesses: BlotterWitness[];
  reliefRequested?: string;
  barangayAction?: {
    actionTaken?: string;
    settledAmicably?: boolean;
    settlementDate?: string;
    settlementDetails?: string;
    endorsedToPNP?: boolean;
    endorsementDate?: string;
    endorsementReason?: string;
  };
  status: BlotterStatus;
  recordedBy: { name: string; position?: string };
  dateRecorded: string;
  lastUpdated?: string;
  isDeleted: boolean;
}

export interface DashboardStats {
  total: number;
  thisMonth: number;
  pending: number;
  settled: number;
  referred: number;
  statusBreakdown: Array<{ status: string; count: number }>;
  typeBreakdown: Array<{ type: string; count: number }>;
  monthlyTrend: Array<{ year: number; month: number; count: number }>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

export interface AuditLog {
  _id: string;
  action?: string;
  performedBy?: { _id: string; fullName?: string; username: string };
  targetBlotter?: { _id: string; blotterNumber?: string };
  targetUser?: { _id: string; fullName?: string; username: string };
  details?: string;
  ipAddress?: string;
  timestamp: string;
}
