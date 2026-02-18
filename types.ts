export enum UserRole {
  OFFICER = 'officer',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}

export interface User {
  id: number;
  police_id: string;
  full_name: string;
  rank: string;
  station_code: string;
  role: UserRole;
}

export interface Driver {
  nic: string; // Primary Key
  full_name: string;
  address: string;
  dob: string;
  contact_number: string;
  license_number: string;
  license_expiry_date: string;
  license_classes: string[]; // e.g. ['A', 'B']
  license_status: 'active' | 'suspended' | 'expired' | 'revoked';
  wanted_status: boolean;
  photo_url: string;
}

export interface Vehicle {
  id: number;
  number_plate: string; // Unique
  make: string;
  model: string;
  year: number;
  color: string;
  owner_nic: string;
  permit_type: string;
  registered_date: string;
  registration_expiry_date: string;
  insurance_provider: string;
  insurance_expiry_date: string;
  revenue_license_expiry: string;
  emission_test_expiry: string;
  stolen_status: boolean;
  driver?: Driver; // Joined data
}

export interface Offense {
  offense_code: string;
  description: string;
  fine_amount: number;
  penalty_points: number;
  category: 'speeding' | 'parking' | 'document' | 'dangerous' | 'dui';
}

export interface Ticket {
  ticket_id: number;
  offense_code: string;
  vehicle_plate: string;
  officer_id: string;
  nic_of_driver: string;
  ticket_date: string;
  location: string;
  status: 'issued' | 'paid' | 'disputed';
  notes?: string;
  offense_details?: Offense; // Joined
}

export interface BlacklistEntry {
  id: number;
  vehicle_plate: string;
  reason: string;
  priority: 'high' | 'medium';
}

export type RiskLevel = 'GREEN' | 'AMBER' | 'RED';