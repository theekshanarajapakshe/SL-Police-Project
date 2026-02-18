import { User, Driver, Vehicle, Ticket, Offense, UserRole, BlacklistEntry } from '../types';

// --- MOCK DATA ---

const MOCK_USERS: User[] = [
  { id: 1, police_id: 'COP001', full_name: 'Sgt. Kamal Perera', rank: 'Sergeant', station_code: 'CMB-01', role: UserRole.OFFICER },
  { id: 2, police_id: 'ADMIN01', full_name: 'DIG Ruwan Silva', rank: 'DIG', station_code: 'HQ', role: UserRole.ADMIN },
];

const MOCK_DRIVERS: Driver[] = [
  {
    nic: '852345678V',
    full_name: 'Nimal Bandara',
    address: '123 Galle Road, Colombo 03',
    dob: '1985-05-12',
    contact_number: '0771234567',
    license_number: 'B1234567',
    license_expiry_date: '2025-12-31',
    license_classes: ['A', 'B', 'C'],
    license_status: 'active',
    wanted_status: false,
    photo_url: 'https://picsum.photos/200'
  },
  {
    nic: '922223456X',
    full_name: 'Sunil Perera',
    address: '45 Kandy Road, Kelaniya',
    dob: '1992-08-20',
    contact_number: '0719876543',
    license_number: 'B9876543',
    license_expiry_date: '2023-01-01', // Expired
    license_classes: ['B'],
    license_status: 'expired',
    wanted_status: true, // WANTED
    photo_url: 'https://picsum.photos/201'
  }
];

const MOCK_VEHICLES: Vehicle[] = [
  {
    id: 1,
    number_plate: 'WP-CAB-1234',
    make: 'Toyota',
    model: 'Corolla Axio',
    year: 2018,
    color: 'White',
    owner_nic: '852345678V',
    permit_type: 'private',
    registered_date: '2018-06-01',
    registration_expiry_date: '2025-06-01',
    insurance_provider: 'Sri Lanka Insurance',
    insurance_expiry_date: '2025-06-01',
    revenue_license_expiry: '2025-06-01',
    emission_test_expiry: '2025-05-20',
    stolen_status: false
  },
  {
    id: 2,
    number_plate: 'WP-KX-9999',
    make: 'Honda',
    model: 'Fit GP5',
    year: 2015,
    color: 'Black',
    owner_nic: '922223456X',
    permit_type: 'private',
    registered_date: '2015-03-15',
    registration_expiry_date: '2024-03-15',
    insurance_provider: 'Ceylinco VIP',
    insurance_expiry_date: '2023-12-01', // Expired
    revenue_license_expiry: '2023-12-01',
    emission_test_expiry: '2023-11-01',
    stolen_status: true // STOLEN
  },
  {
    id: 3,
    number_plate: 'SP-HAA-4567',
    make: 'Bajaj',
    model: 'RE 4S',
    year: 2020,
    color: 'Red',
    owner_nic: '852345678V',
    permit_type: 'taxi',
    registered_date: '2020-01-10',
    registration_expiry_date: '2024-01-10', // Just Expired
    insurance_provider: 'Co-op Insurance',
    insurance_expiry_date: '2025-01-10',
    revenue_license_expiry: '2024-01-10',
    emission_test_expiry: '2024-01-05',
    stolen_status: false
  }
];

const MOCK_OFFENSES: Offense[] = [
  { offense_code: 'SPD-01', description: 'Speeding (10-20kmph over)', fine_amount: 3000, penalty_points: 2, category: 'speeding' },
  { offense_code: 'DOC-02', description: 'Driving without valid insurance', fine_amount: 5000, penalty_points: 0, category: 'document' },
  { offense_code: 'DUI-01', description: 'Driving under influence', fine_amount: 25000, penalty_points: 10, category: 'dui' },
  { offense_code: 'PAR-03', description: 'Illegal Parking', fine_amount: 1000, penalty_points: 0, category: 'parking' },
  { offense_code: 'MOB-05', description: 'Using Mobile Phone while driving', fine_amount: 2000, penalty_points: 2, category: 'dangerous' },
];

let MOCK_TICKETS: Ticket[] = [
  {
    ticket_id: 1001,
    offense_code: 'SPD-01',
    vehicle_plate: 'WP-CAB-1234',
    officer_id: 'COP001',
    nic_of_driver: '852345678V',
    ticket_date: '2023-10-15',
    location: 'Colombo 03',
    status: 'paid',
    offense_details: MOCK_OFFENSES[0]
  }
];

// --- SERVICE METHODS ---

export const db = {
  login: async (badge: string, pass: string): Promise<User | null> => {
    // Simulate API delay
    await new Promise(r => setTimeout(r, 500));
    // Hardcoded auth
    if (badge === 'COP001' && pass === 'password') return MOCK_USERS[0];
    if (badge === 'ADMIN01' && pass === 'admin') return MOCK_USERS[1];
    return null;
  },

  searchVehicle: async (plate: string): Promise<Vehicle | null> => {
    await new Promise(r => setTimeout(r, 600));
    // Normalize plate
    const normalized = plate.replace(/[-\s]/g, '').toUpperCase();
    
    const vehicle = MOCK_VEHICLES.find(v => 
      v.number_plate.replace(/[-\s]/g, '').toUpperCase() === normalized
    );

    if (!vehicle) return null;

    // Join driver data
    const driver = MOCK_DRIVERS.find(d => d.nic === vehicle.owner_nic);
    return { ...vehicle, driver };
  },

  getOffenses: async (): Promise<Offense[]> => {
    return MOCK_OFFENSES;
  },

  issueTicket: async (ticket: Omit<Ticket, 'ticket_id' | 'offense_details'>): Promise<Ticket> => {
    await new Promise(r => setTimeout(r, 800));
    const newTicket: Ticket = {
      ...ticket,
      ticket_id: Math.floor(Math.random() * 10000) + 2000,
      offense_details: MOCK_OFFENSES.find(o => o.offense_code === ticket.offense_code)
    };
    MOCK_TICKETS = [newTicket, ...MOCK_TICKETS];
    return newTicket;
  },

  getVehicleTickets: async (plate: string): Promise<Ticket[]> => {
    return MOCK_TICKETS.filter(t => t.vehicle_plate === plate);
  },

  getAllTickets: async (): Promise<Ticket[]> => {
    return MOCK_TICKETS;
  },

  // Admin Stats
  getStats: async () => {
    return {
      totalVehicles: MOCK_VEHICLES.length,
      totalDrivers: MOCK_DRIVERS.length,
      ticketsIssued: MOCK_TICKETS.length,
      revenue: MOCK_TICKETS.reduce((acc, t) => acc + (t.offense_details?.fine_amount || 0), 0)
    };
  }
};