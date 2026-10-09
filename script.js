/* ============================================================
   FLEETPRO VMS — Full-stack-style application logic
   ============================================================ */

/* ---------- STATE ---------- */
const S = {
  user: null, page: 'dashboard', vehicles: [], drivers: [], trips: [], fuel: [],
  maintenance: [], expenses: [], notifications: [], geofences: [], documents: [],
  users: [], auditLogs: [], departments: [], branches: [],
  theme: localStorage.getItem('fp_theme') || 'dark',
  language: localStorage.getItem('fp_lang') || 'en',
  map: null, geoMap: null, vehicleMarkers: {}, trails: {}, selectedVehicle: null,
  charts: {}, gpsTimer: null, sidebarOpen: false
};

/* ---------- I18N ---------- */
const I18N = {
  en: {
    dashboard:'Dashboard', liveTracking:'Live Tracking', vehicles:'Vehicles', drivers:'Drivers',
    trips:'Trips', fuel:'Fuel', maintenance:'Maintenance', expenses:'Expenses',
    geofences:'Geofences', reports:'Reports', notifications:'Notifications',
    documents:'Documents', users:'Users', settings:'Settings',
    totalVehicles:'Total Vehicles', activeVehicles:'Active Vehicles', inMaintenance:'In Maintenance',
    totalDrivers:'Total Drivers', movingVehicles:'Moving', stoppedVehicles:'Stopped', offlineVehicles:'Offline',
    fuelConsumption:'Fuel Consumption', fuelCost:'Fuel Cost', maintenanceCost:'Maintenance Cost',
    totalExpenses:'Total Fleet Expenses', upcomingMaintenance:'Upcoming Maintenance',
    addVehicle:'Add Vehicle', addDriver:'Add Driver', addTrip:'Add Trip', addFuel:'Add Fuel',
    addMaintenance:'Add Maintenance', addExpense:'Add Expense', save:'Save', cancel:'Cancel',
    search:'Search', filter:'Filter', export:'Export', all:'All', status:'Status',
    actions:'Actions', view:'View', edit:'Edit', delete:'Delete', confirm:'Confirm',
    welcome:'Welcome back', totalTrips:'Total Trips', utilization:'Utilization',
    searchPlaceholder:'Search vehicles, drivers, trips...',
    liveMap:'Live Fleet Map', speed:'Speed', ignition:'Ignition',
    vehicleList:'Vehicle List', noData:'No data to display', loading:'Loading...',
    saveSuccess:'Saved successfully', deleteConfirm:'Are you sure you want to delete this record?',
    deleted:'Record deleted', updated:'Record updated', created:'Record created'
  },
  am: {
    dashboard:'ዳሽቦርድ', liveTracking:'ቀጥታ ክትትል', vehicles:'ተሽከርካሪዎች', drivers:'ነጂዎች',
    trips:'ጉዞዎች', fuel:'ነዳጅ', maintenance:'ጥገና', expenses:'ወጪዎች',
    geofences:'ጂኦፌንስ', reports:'ሪፖርቶች', notifications:'ማሳወቂያዎች',
    documents:'ሰነዶች', users:'ተጠቃሚዎች', settings:'ቅንብሮች',
    totalVehicles:'ጠቅላላ ተሽከርካሪዎች', activeVehicles:'ንቁ ተሽከርካሪዎች', inMaintenance:'ጥገና ላይ',
    totalDrivers:'ጠቅላላ ነጂዎች', movingVehicles:'በአንቀሳቃሽ', stoppedVehicles:'ቆሟል', offlineVehicles:'መስመር ውጭ',
    fuelConsumption:'የነዳጅ ፍጆታ', fuelCost:'የነዳጅ ወጪ', maintenanceCost:'የጥገና ወጪ',
    totalExpenses:'ጠቅላላ የፍሌት ወጪዎች', upcomingMaintenance:'ቀጣይ ጥገና',
    addVehicle:'ተሽከርካሪ ያክሉ', addDriver:'ነጂ ያክሉ', addTrip:'ጉዞ ያክሉ', addFuel:'ነዳጅ ያክሉ',
    addMaintenance:'ጥገና ያክሉ', addExpense:'ወጪ ያክሉ', save:'አስቀምጥ', cancel:'ይቅር',
    search:'ፈልግ', filter:'አጣራ', export:'ላክ', all:'ሁሉ', status:'ሁኔታ',
    actions:'እርምጃዎች', view:'እይ', edit:'አርትዕ', delete:'ሰርዝ', confirm:'አረጋግጥ',
    welcome:'እንኳን በደህና መጡ', totalTrips:'ጠቅላላ ጉዞዎች', utilization:'አጠቃቀም',
    searchPlaceholder:'ተሽከርካሪዎችን፣ ነጂዎችን፣ ጉዞዎችን ይፈልጉ...',
    liveMap:'ቀጥታ የፍሌት ካርታ', speed:'ፍጥነት', ignition:'እሳት',
    vehicleList:'የተሽከርካሪ ዝርዝር', noData:'ምንም ውሂብ የለም', loading:'በመጫን ላይ...',
    saveSuccess:'በተሳካ ሁኔታ ተቀምጧል', deleteConfirm:'ውሂቡን መሰረዝ ይፈልጋሉ?',
    deleted:'ውሂብ ተሰርዟል', updated:'ውሂብ ተዘምኗል', created:'ውሂብ ተፈጥሯል'
  }
};
const t = k => (I18N[S.language] && I18N[S.language][k]) || I18N.en[k] || k;

/* ---------- ICONS ---------- */
const IC = {
  dashboard:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>',
  tracking:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-10 8-14a8 8 0 10-16 0c0 4 8 14 8 14z"/><circle cx="12" cy="8" r="3"/></svg>',
  vehicles:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 17H3v-5l2-5h11l2 5v5h-2"/><circle cx="7.5" cy="17.5" r="2"/><circle cx="15.5" cy="17.5" r="2"/></svg>',
  drivers:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  trips:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
  fuel:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 22h12v-9a3 3 0 00-3-3H6a3 3 0 00-3 3v9z"/><path d="M3 10V6a2 2 0 012-2h8a2 2 0 012 2v4M15 8h2a3 3 0 013 3v6a2 2 0 01-2 2 2 2 0 01-2-2"/></svg>',
  maintenance:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>',
  expenses:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>',
  geofences:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',
  reports:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/></svg>',
  notifications:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>',
  documents:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
  users:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>',
  settings:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>'
};

/* ---------- ROLE PERMISSIONS ---------- */
const ROLES = {
  super_admin: { label:'Super Admin', pages:['dashboard','liveTracking','vehicles','drivers','trips','fuel','maintenance','expenses','geofences','reports','notifications','documents','users','settings'] },
  fleet_manager: { label:'Fleet Manager', pages:['dashboard','liveTracking','vehicles','drivers','trips','fuel','maintenance','expenses','geofences','reports','notifications','documents'] },
  administrator: { label:'Administrator', pages:['dashboard','liveTracking','vehicles','drivers','trips','fuel','maintenance','expenses','reports','notifications','documents','users','settings'] },
  dispatcher: { label:'Dispatcher', pages:['dashboard','liveTracking','trips','drivers'] },
  driver: { label:'Driver', pages:['dashboard','trips','documents'] },
  accountant: { label:'Accountant', pages:['dashboard','fuel','expenses','reports'] },
  maintenance_manager: { label:'Maintenance Manager', pages:['dashboard','vehicles','maintenance','reports'] },
  viewer: { label:'Viewer', pages:['dashboard','reports'] }
};

/* ---------- DEMO DATA ---------- */
const ADDIS_ROUTES = [
  [[9.0320,38.7463],[9.0353,38.7453],[9.0385,38.7448],[9.0410,38.7420],[9.0435,38.7395],[9.0450,38.7380]],
  [[9.0320,38.7463],[9.0290,38.7490],[9.0260,38.7520],[9.0250,38.7560],[9.0240,38.7600],[9.0230,38.7641]],
  [[9.0116,38.7641],[9.0140,38.7670],[9.0170,38.7700],[9.0200,38.7730],[9.0230,38.7760],[9.0260,38.7790]],
  [[8.9779,38.7993],[8.9800,38.7960],[8.9830,38.7920],[8.9860,38.7880],[8.9900,38.7840],[8.9940,38.7800]],
  [[9.0339,38.7421],[9.0310,38.7390],[9.0280,38.7360],[9.0250,38.7330],[9.0220,38.7300],[9.0190,38.7270]],
  [[9.0353,38.7453],[9.0380,38.7480],[9.0410,38.7510],[9.0440,38.7540],[9.0470,38.7570],[9.0500,38.7600]],
  [[9.0320,38.7463],[9.0325,38.7500],[9.0330,38.7540],[9.0335,38.7580],[9.0340,38.7620],[9.0345,38.7660]],
  [[9.0116,38.7641],[9.0090,38.7610],[9.0060,38.7580],[9.0030,38.7550],[9.0000,38.7520],[8.9970,38.7490]],
  [[9.0440,38.7540],[9.0410,38.7570],[9.0380,38.7600],[9.0350,38.7630],[9.0320,38.7660],[9.0290,38.7690]],
  [[8.9940,38.7800],[8.9970,38.7770],[9.0000,38.7740],[9.0030,38.7710],[9.0060,38.7680],[9.0090,38.7650]]
];

const VEHICLE_NAMES = [
  {reg:'AA-23847', make:'Toyota', model:'Hilux Pickup', year:2022, type:'Pickup', color:'White', fuelType:'Diesel', tankCapacity:80, dept:'Logistics'},
  {reg:'AA-45921', make:'Isuzu', model:'FTR 850', year:2021, type:'Truck', color:'Yellow', fuelType:'Diesel', tankCapacity:200, dept:'Logistics'},
  {reg:'AA-58234', make:'Toyota', model:'Land Cruiser', year:2023, type:'SUV', color:'Black', fuelType:'Diesel', tankCapacity:138, dept:'Management'},
  {reg:'AA-67382', make:'Hyundai', model:'County Bus', year:2020, type:'Bus', color:'Blue', fuelType:'Diesel', tankCapacity:150, dept:'Transport'},
  {reg:'AA-71255', make:'Toyota', model:'Corolla', year:2022, type:'Sedan', color:'Silver', fuelType:'Petrol', tankCapacity:50, dept:'Sales'},
  {reg:'AA-34891', make:'Mitsubishi', model:'Fuso Canter', year:2019, type:'Truck', color:'White', fuelType:'Diesel', tankCapacity:100, dept:'Logistics'},
  {reg:'AA-89524', make:'Ford', model:'Transit Van', year:2023, type:'Van', color:'White', fuelType:'Diesel', tankCapacity:80, dept:'Operations'},
  {reg:'AA-12834', make:'Nissan', model:'Patrol', year:2021, type:'SUV', color:'Green', fuelType:'Diesel', tankCapacity:140, dept:'Field Operations'},
  {reg:'AA-92734', make:'Suzuki', model:'SX4', year:2020, type:'Sedan', color:'Grey', fuelType:'Petrol', tankCapacity:43, dept:'Sales'},
  {reg:'AA-41267', make:'Toyota', model:'Coaster', year:2022, type:'Bus', color:'White', fuelType:'Diesel', tankCapacity:95, dept:'Transport'}
];

const DRIVER_NAMES = [
  {name:'Abebe Bekele', phone:'+251911234567', dept:'Logistics'},
  {name:'Tadesse Gemechu', phone:'+251911345678', dept:'Logistics'},
  {name:'Yohannes Haile', phone:'+251911456789', dept:'Management'},
  {name:'Meron Tadesse', phone:'+251911567890', dept:'Transport'},
  {name:'Solomon Getachew', phone:'+251911678901', dept:'Logistics'},
  {name:'Tigist Alemu', phone:'+251911789012', dept:'Operations'},
  {name:'Daniel Kebede', phone:'+251911890123', dept:'Field Operations'},
  {name:'Hana Tesfaye', phone:'+251911901234', dept:'Sales'},
  {name:'Bewket Asefa', phone:'+251912012345', dept:'Sales'},
  {name:'Selamawit Girma', phone:'+251912123456', dept:'Transport'}
];

function rand(min, max) { return Math.random() * (max - min) + min; }
function randInt(min, max) { return Math.floor(rand(min, max + 1)); }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function fmtDate(d) {
  if (!d) return '—';
  const dt = new Date(d);
  return dt.toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });
}
function fmtDateTime(d) {
  if (!d) return '—';
  const dt = new Date(d);
  return dt.toLocaleString('en-GB', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' });
}
function fmtMoney(n) { return 'ETB ' + (n||0).toLocaleString('en-US', {maximumFractionDigits:2}); }
function fmtNum(n, d=2) { return (n||0).toLocaleString('en-US', {maximumFractionDigits:d}); }
function daysFromNow(d) { return Math.ceil((new Date(d) - new Date()) / 86400000); }
function uid() { return Math.random().toString(36).slice(2, 10); }

function initDemoData() {
  // Vehicles
  S.vehicles = VEHICLE_NAMES.map((v, i) => {
    const status = pick(['moving','moving','moving','stopped','idle','maintenance','offline','stopped','idle','moving']);
    const route = ADDIS_ROUTES[i % ADDIS_ROUTES.length];
    const pos = route[0];
    return {
      id: 'V' + (1001 + i),
      reg: v.reg, make: v.make, model: v.model, year: v.year, type: v.type, color: v.color,
      vin: 'JTEBU14R' + (24000000 + i * 12345), engine: 'ENG' + (900000 + i * 1234),
      fuelType: v.fuelType, tankCapacity: v.tankCapacity, mileage: randInt(15000, 185000),
      purchaseDate: `20${20 + (i%5)}-0${(i%9)+1}-1${i%9}`, purchasePrice: randInt(800000, 4500000),
      dept: v.dept, branch: pick(['Addis Ababa HQ', 'Bole Branch', 'Mekelle Branch', 'Hawassa Branch']),
      driverId: 'D' + (2001 + i),
      gpsDevice: 'GPS-' + (3001 + i),
      status, lat: pos[0], lng: pos[1], speed: status==='moving'?rand(20,80):0,
      heading: randInt(0, 359), ignition: status==='moving'||status==='idle', fuelLevel: randInt(25, 95),
      route, routeIdx: 0, routeDir: 1, lastUpdate: new Date().toISOString(),
      currentTrip: status==='moving' ? 'TRP-' + uid() : null
    };
  });

  // Drivers
  S.drivers = DRIVER_NAMES.map((d, i) => ({
    id: 'D' + (2001 + i), name: d.name, phone: d.phone, email: d.name.toLowerCase().replace(' ','.') + '@fleetpro.et',
    address: pick(['Addis Ababa, Bole', 'Addis Ababa, Piazza', 'Addis Ababa, Megenagna', 'Addis Ababa, Sarbet']),
    license: 'DL-' + (10000 + i * 137), licenseCat: pick(['A','B','C','D','E','B1','B2']),
    licenseIssue: '2019-0' + ((i%9)+1) + '-15',
    licenseExpiry: `202${4 + (i%3)}-0${(i%9)+1}-15`,
    employed: '201' + (8 + (i%5)) + '-0' + ((i%9)+1) + '-01',
    dept: d.dept, assignedVehicle: 'V' + (1001 + i),
    status: pick(['active','active','active','active','active','on_leave','active','active','active','suspended']),
    emergency: '+2519' + (10000000 + i * 111111),
    trips: randInt(120, 580), distance: randInt(5000, 95000), speedingEvents: randInt(2, 38),
    harshBraking: randInt(0, 22), harshAccel: randInt(0, 18), idlingTime: randInt(120, 1200),
    accidents: randInt(0, 3), score: randInt(72, 98)
  }));

  // Trips
  S.trips = [];
  const tripPurposes = ['Cargo Delivery','Customer Visit','Field Inspection','Passenger Transport','Maintenance Run','Airport Pickup','Office Errand'];
  for (let i = 0; i < 28; i++) {
    const v = pick(S.vehicles);
    const d = pick(S.drivers);
    const start = new Date(Date.now() - randInt(0, 7) * 86400000 - randInt(0, 23) * 3600000);
    const dur = randInt(30, 240);
    const end = new Date(start.getTime() + dur * 60000);
    const dist = randInt(8, 220);
    S.trips.push({
      id: 'TRP-' + uid().toUpperCase().slice(0,6), vehicleId: v.id, driverId: d.id,
      vehicle: v.reg, driver: d.name, start: pick(['Meskel Square','Bole Airport','Megenagna','Piazza','Merkato','Sarbet','Mekanisa']),
      destination: pick(['Debre Zeit','Adama','Bishoftu','Debre Markos','Jimma','Hawassa','Bahir Dar']),
      startDate: start.toISOString(), endDate: end.toISOString(),
      distance: dist, duration: dur, avgSpeed: Math.round(dist / (dur/60)),
      purpose: pick(tripPurposes), cargo: pick(['Electronics','Documents','Passengers','Spare Parts','Food Items','Construction Material','']),
      status: pick(['completed','completed','completed','in_progress','scheduled','cancelled']),
      notes: '', fuelUsed: Math.round(dist / rand(6, 12))
    });
  }

  // Fuel
  S.fuel = [];
  const stations = ['Total Bole','Shell Sarbet','NOC Megenagna','Yetem Merkato','Oil Libya Piazza','Total Old Airport'];
  for (let i = 0; i < 45; i++) {
    const v = pick(S.vehicles);
    const d = pick(S.drivers);
    const dt = new Date(Date.now() - randInt(0, 30) * 86400000 - randInt(0, 23) * 3600000);
    const liters = randInt(20, 120);
    const price = v.fuelType === 'Diesel' ? 78.54 : 92.30;
    S.fuel.push({
      id: 'F' + uid(), vehicleId: v.id, driverId: d.id, vehicle: v.reg, driver: d.name,
      date: dt.toISOString(), station: pick(stations), fuelType: v.fuelType,
      liters, pricePerL: price, total: liters * price,
      odometer: randInt(15000, 185000), method: pick(['Cash','Card','Voucher','Credit']),
      receipt: 'RCPT-' + randInt(10000, 99999), notes: ''
    });
  }
  S.fuel.sort((a,b) => new Date(b.date) - new Date(a.date));

  // Maintenance
  S.maintenance = [];
  const types = ['Oil Change','Tire Replacement','Brake Service','Engine Service','Battery','Transmission','Suspension','Electrical','Inspection','General Service'];
  const providers = ['Toyota 4S Bole','ANBESSA Garage','KAKI Motors','Hilton Service','MH Garage','Walta Auto'];
  for (let i = 0; i < 18; i++) {
    const v = pick(S.vehicles);
    const dt = new Date(Date.now() - randInt(0, 60) * 86400000);
    const labor = randInt(500, 8000);
    const parts = randInt(800, 25000);
    S.maintenance.push({
      id: 'M' + uid(), vehicleId: v.id, vehicle: v.reg,
      type: pick(types), date: dt.toISOString(), mileage: randInt(15000, 185000),
      provider: pick(providers), labor, parts, total: labor + parts,
      nextDate: new Date(dt.getTime() + randInt(20, 90) * 86400000).toISOString(),
      nextMileage: randInt(160000, 200000),
      description: 'Routine ' + pick(types).toLowerCase() + ' service performed.',
      status: pick(['completed','completed','completed','scheduled','in_progress'])
    });
  }

  // Expenses
  S.expenses = [];
  const cats = ['Fuel','Maintenance','Insurance','Registration','Spare Parts','Tolls','Parking','Driver Expenses','Fines','Other'];
  const vendors = ['Ministry of Transport','TSE Insurance','Ethio Telecom','Addis Parking','City Road Authority','Garage ABC'];
  for (let i = 0; i < 32; i++) {
    const v = pick(S.vehicles);
    const d = pick(S.drivers);
    const dt = new Date(Date.now() - randInt(0, 45) * 86400000);
    const cat = pick(cats);
    S.expenses.push({
      id: 'E' + uid(), vehicleId: v.id, driverId: d.id, vehicle: v.reg, driver: d.name,
      category: cat, amount: randInt(200, 45000), currency: 'ETB',
      date: dt.toISOString(), vendor: pick(vendors), description: cat + ' expense'
    });
  }

  // Notifications
  S.notifications = [
    { id:'N1', type:'overspeeding', title:'Overspeeding detected', message:'Vehicle AA-23847 was traveling at 92 km/h on Bole Road', time: new Date(Date.now() - 1200000).toISOString(), read:false, severity:'warning' },
    { id:'N2', type:'geofence', title:'Geofence violation', message:'Vehicle AA-45921 exited depot zone without authorization', time: new Date(Date.now() - 3600000).toISOString(), read:false, severity:'danger' },
    { id:'N3', type:'maintenance', title:'Maintenance overdue', message:'Vehicle AA-58234 has missed scheduled oil change by 3 days', time: new Date(Date.now() - 86400000).toISOString(), read:false, severity:'warning' },
    { id:'N4', type:'insurance', title:'Insurance expiring', message:'Vehicle AA-67382 insurance expires in 15 days', time: new Date(Date.now() - 172800000).toISOString(), read:true, severity:'info' },
    { id:'N5', type:'fuel', title:'Fuel anomaly detected', message:'Possible fuel theft: 18L drop detected on AA-34891 at 02:14 AM', time: new Date(Date.now() - 259200000).toISOString(), read:true, severity:'danger' },
    { id:'N6', type:'license', title:'License expiring', message:'Driver Abebe Bekele license expires in 7 days', time: new Date(Date.now() - 432000000).toISOString(), read:true, severity:'warning' },
    { id:'N7', type:'offline', title:'GPS device offline', message:'GPS device on AA-89524 has been offline for 45 minutes', time: new Date(Date.now() - 518400000).toISOString(), read:true, severity:'info' },
    { id:'N8', type:'idle', title:'Excessive idling', message:'Vehicle AA-12834 idled for 1h 24m at Sarbet junction', time: new Date(Date.now() - 604800000).toISOString(), read:true, severity:'warning' }
  ];

  // Geofences
  S.geofences = [
    { id:'G1', name:'HQ Office', type:'circle', lat:9.0320, lng:38.7463, radius:300, vehicles:5, alerts:'entry,exit' },
    { id:'G2', name:'Bole Depot', type:'circle', lat:8.9779, lng:38.7993, radius:500, vehicles:3, alerts:'entry,exit' },
    { id:'G3', name:'Merkato Warehouse', type:'circle', lat:9.0339, lng:38.7421, radius:200, vehicles:2, alerts:'entry' },
    { id:'G4', name:'Megenagna Hub', type:'circle', lat:9.0116, lng:38.7641, radius:350, vehicles:4, alerts:'exit' }
  ];

  // Documents
  S.documents = [
    { id:'DOC1', vehicle:'AA-23847', type:'Registration', expiry:'2025-08-15', status:'valid' },
    { id:'DOC2', vehicle:'AA-23847', type:'Insurance', expiry:'2024-12-20', status:'expiring' },
    { id:'DOC3', vehicle:'AA-45921', type:'Inspection', expiry:'2024-11-30', status:'expiring' },
    { id:'DOC4', vehicle:'AA-58234', type:'Insurance', expiry:'2024-09-12', status:'expired' },
    { id:'DOC5', vehicle:'AA-67382', type:'Registration', expiry:'2026-03-10', status:'valid' },
    { id:'DOC6', vehicle:'AA-71255', type:'Insurance', expiry:'2025-05-22', status:'valid' },
    { id:'DOC7', vehicle:'AA-34891', type:'License', expiry:'2024-10-05', status:'expired' }
  ];

  // Users (Mock Database with custom credentials)
  S.users = [
    { id:'U1', name:'Dawit Mengistu', email:'super@fleet.com', role:'super_admin', status:'active', lastLogin: new Date(Date.now() - 1800000).toISOString(), password:'super123' },
    { id:'U2', name:'Selam Awol', email:'manager@fleet.com', role:'fleet_manager', status:'active', lastLogin: new Date(Date.now() - 7200000).toISOString(), password:'manager123' },
    { id:'U3', name:'Marta Tola', email:'dispatch@fleet.com', role:'dispatcher', status:'active', lastLogin: new Date(Date.now() - 36000000).toISOString(), password:'dispatch123' },
    { id:'U4', name:'Yonas Bekele', email:'driver@fleet.com', role:'driver', status:'active', lastLogin: new Date(Date.now() - 86400000).toISOString(), password:'driver123' },
    { id:'U5', name:'Helen Girma', email:'accounts@fleet.com', role:'accountant', status:'active', lastLogin: new Date(Date.now() - 7200000).toISOString(), password:'accounts123' },
    { id:'U6', name:'Robel Solomon', email:'maint@fleet.com', role:'maintenance_manager', status:'active', lastLogin: new Date(Date.now() - 43200000).toISOString(), password:'maint123' },
    { id:'U7', name:'Bethel Asefa', email:'viewer@fleet.com', role:'viewer', status:'inactive', lastLogin: new Date(Date.now() - 604800000).toISOString(), password:'viewer123' }
  ];

  // Audit logs
  S.auditLogs = [
    { id:'A1', user:'Dawit Mengistu', action:'Created vehicle AA-41267', entity:'vehicle', time:new Date(Date.now() - 3600000).toISOString(), ip:'196.188.45.12' },
    { id:'A2', user:'Selam Awol', action:'Assigned Driver Abebe Bekele to AA-23847', entity:'assignment', time:new Date(Date.now() - 7200000).toISOString(), ip:'196.188.45.12' },
    { id:'A3', user:'Helen Girma', action:'Updated fuel transaction F' + uid(), entity:'fuel', time:new Date(Date.now() - 14400000).toISOString(), ip:'196.188.45.18' },
    { id:'A4', user:'Dawit Mengistu', action:'Deleted maintenance record', entity:'maintenance', time:new Date(Date.now() - 86400000).toISOString(), ip:'196.188.45.12' },
    { id:'A5', user:'Marta Tola', action:'Created new trip TRP-XY8923', entity:'trip', time:new Date(Date.now() - 172800000).toISOString(), ip:'196.188.45.21' }
  ];

  S.departments = ['Logistics','Management','Transport','Sales','Operations','Field Operations','Finance','Maintenance'];
  S.branches = ['Addis Ababa HQ','Bole Branch','Mekelle Branch','Hawassa Branch','Bahir Dar Branch'];
}

/* ---------- AUTH ---------- */
function login(email, password, role = null) {
  // Check if user exists in the mock database
  const userRecord = S.users.find(u => u.email === email);
  
  // Verify credentials
  if (!userRecord || userRecord.password !== password) {
    toast('Invalid email or password', 'danger');
    return false;
  }

  // If role is specified (quick demo login), ensure the user has that role
  if (role && userRecord.role !== role) {
    toast('Access denied for this role', 'danger');
    return false;
  }

  const roleData = ROLES[userRecord.role];
  S.user = {
    name: userRecord.name,
    email: userRecord.email,
    role: userRecord.role,
    roleLabel: roleData.label,
    pages: roleData.pages
  };
  
  // Update last login
  userRecord.lastLogin = new Date().toISOString();
  
  localStorage.setItem('fp_user', JSON.stringify(S.user));
  document.getElementById('loginScreen').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
  buildSidebar();
  updateTopbar();
  setPage('dashboard');
  startGPSSimulation();
  toast('Signed in as ' + roleData.label, 'success');
  return true;
}

function logout() {
  S.user = null;
  localStorage.removeItem('fp_user');
  stopGPSSimulation();
  document.getElementById('app').classList.add('hidden');
  document.getElementById('loginScreen').classList.remove('hidden');
  
  // Clear login form
  document.getElementById('loginEmail').value = '';
  document.getElementById('loginPassword').value = '';
}

/* ---------- SIDEBAR ---------- */
function buildSidebar() {
  if (!S.user) return;
  const nav = document.getElementById('sidebarNav');
  const items = [
    { key:'dashboard', label:t('dashboard'), icon:IC.dashboard },
    { key:'liveTracking', label:t('liveTracking'), icon:IC.tracking },
    { key:'vehicles', label:t('vehicles'), icon:IC.vehicles },
    { key:'drivers', label:t('drivers'), icon:IC.drivers },
    { key:'trips', label:t('trips'), icon:IC.trips },
    { key:'fuel', label:t('fuel'), icon:IC.fuel },
    { key:'maintenance', label:t('maintenance'), icon:IC.maintenance },
    { key:'expenses', label:t('expenses'), icon:IC.expenses },
    { key:'geofences', label:t('geofences'), icon:IC.geofences },
    { key:'reports', label:t('reports'), icon:IC.reports },
    { key:'notifications', label:t('notifications'), icon:IC.notifications },
    { key:'documents', label:t('documents'), icon:IC.documents },
    { key:'users', label:t('users'), icon:IC.users },
    { key:'settings', label:t('settings'), icon:IC.settings }
  ];
  nav.innerHTML = items.filter(i => S.user.pages.includes(i.key))
    .map(i => `<a class="sidebar-link ${S.page===i.key?'active':''}" onclick="setPage('${i.key}')">${i.icon}<span>${i.label}</span></a>`).join('');
}

function setPage(p) {
  if (!S.user || !S.user.pages.includes(p)) { toast('Access denied for your role', 'danger'); return; }
  S.page = p;
  buildSidebar();
  document.getElementById('mainContent').classList.remove('fade-in');
  void document.getElementById('mainContent').offsetWidth;
  document.getElementById('mainContent').classList.add('fade-in');
  renderPage();
  toggleSidebar(false);
  if (window.innerWidth < 1024) toggleSidebar(false);
}

/* ---------- TOPBAR ---------- */
function updateTopbar() {
  if (!S.user) return;
  const initials = S.user.name.split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase();
  document.getElementById('userAvatar').textContent = initials;
  document.getElementById('userName').textContent = S.user.name;
  document.getElementById('userRole').textContent = S.user.roleLabel;
  document.getElementById('langLabel').textContent = S.language.toUpperCase();
  const unread = S.notifications.filter(n => !n.read).length;
  document.getElementById('notifBadge').textContent = unread;
  document.getElementById('notifBadge').style.display = unread ? 'flex' : 'none';
  document.getElementById('themeIcon').innerHTML = S.theme === 'dark' 
    ? '<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>'
    : '<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>';
}

function toggleSidebar(open) {
  S.sidebarOpen = open;
  document.getElementById('sidebar').classList.toggle('open', open);
  document.getElementById('sidebarBackdrop').classList.toggle('hidden', !open);
}
function toggleLangMenu() { document.getElementById('langMenu').classList.toggle('hidden'); }
function toggleProfileMenu() { document.getElementById('profileMenu').classList.toggle('hidden'); }
document.addEventListener('click', e => {
  if (!e.target.closest('#langBtn')) document.getElementById('langMenu').classList.add('hidden');
  if (!e.target.closest('#profileBtn')) document.getElementById('profileMenu').classList.add('hidden');
});

function setLanguage(lang) {
  S.language = lang;
  localStorage.setItem('fp_lang', lang);
  document.getElementById('langMenu').classList.add('hidden');
  updateTopbar();
  buildSidebar();
  renderPage();
  toast(lang === 'am' ? 'ቋንቋ ቀይሯል' : 'Language changed', 'success');
}

function toggleTheme() {
  S.theme = S.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('fp_theme', S.theme);
  document.documentElement.classList.toggle('light', S.theme === 'light');
  document.documentElement.classList.toggle('dark', S.theme === 'dark');
  updateTopbar();
  if (S.charts) { Object.values(S.charts).forEach(c => c && c.destroy && c.destroy()); S.charts = {}; }
  renderPage();
}

/* ---------- TOAST ---------- */
function toast(msg, type='info', duration=3000) {
  const colors = { success:'#10b981', danger:'#ef4444', warning:'#eab308', info:'#06b6d4' };
  const icons = {
    success:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>',
    danger:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>',
    warning:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>',
    info:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>'
  };
  const el = document.createElement('div');
  el.className = 'toast';
  el.style.borderColor = colors[type] + '40';
  el.innerHTML = `<div style="color:${colors[type]}">${icons[type]}</div><div class="flex-1">${msg}</div>`;
  document.getElementById('toastContainer').appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; setTimeout(() => el.remove(), 300); }, duration);
}

/* ---------- MODAL ---------- */
function openModal(title, bodyHTML, footerHTML='', size='md') {
  const maxW = { sm:'max-w-md', md:'max-w-xl', lg:'max-w-3xl', xl:'max-w-5xl' }[size];
  document.getElementById('modalMount').innerHTML = `
    <div class="modal-backdrop" onclick="if(event.target===this)closeModal()">
      <div class="card w-full ${maxW} max-h-[90vh] flex flex-col slide-up" onclick="event.stopPropagation()">
        <div class="flex items-center justify-between p-4 border-b" style="border-color:var(--border)">
          <h3 class="font-display font-bold text-lg">${title}</h3>
          <button class="btn-ghost p-1.5" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
        </div>
        <div class="p-5 overflow-y-auto flex-1">${bodyHTML}</div>
        ${footerHTML ? `<div class="p-4 border-t flex justify-end gap-2" style="border-color:var(--border)">${footerHTML}</div>` : ''}
      </div>
    </div>`;
}
function closeModal() { document.getElementById('modalMount').innerHTML = ''; }
function confirmDialog(msg, onConfirm) {
  openModal('Please confirm', `<p class="text-sm" style="color:var(--fg-muted)">${msg}</p>`,
    `<button class="btn-ghost" onclick="closeModal()">Cancel</button><button class="btn-primary" onclick="(${onConfirm})();closeModal()">Confirm</button>`, 'sm');
}

/* ---------- PAGE ROUTER ---------- */
function renderPage() {
  // Destroy existing charts to prevent memory leaks
  Object.values(S.charts).forEach(c => { try { c.destroy(); } catch(e){} });
  S.charts = {};

  const p = S.page;
  if (p === 'dashboard') return renderDashboard();
  if (p === 'liveTracking') return renderLiveTracking();
  if (p === 'vehicles') return renderVehicles();
  if (p === 'drivers') return renderDrivers();
  if (p === 'trips') return renderTrips();
  if (p === 'fuel') return renderFuel();
  if (p === 'maintenance') return renderMaintenance();
  if (p === 'expenses') return renderExpenses();
  if (p === 'geofences') return renderGeofences();
  if (p === 'reports') return renderReports();
  if (p === 'notifications') return renderNotifications();
  if (p === 'documents') return renderDocuments();
  if (p === 'users') return renderUsers();
  if (p === 'settings') return renderSettings();
}

/* ============================================================
   DASHBOARD
   ============================================================ */
function renderDashboard() {
  const v = S.vehicles;
  const totalV = v.length;
  const activeV = v.filter(x => x.status === 'moving' || x.status === 'idle').length;
  const maintV = v.filter(x => x.status === 'maintenance').length;
  const moving = v.filter(x => x.status === 'moving').length;
  const stopped = v.filter(x => x.status === 'stopped').length;
  const offline = v.filter(x => x.status === 'offline').length;
  const idle = v.filter(x => x.status === 'idle').length;
  const totalD = S.drivers.length;
  const activeD = S.drivers.filter(d => d.status === 'active').length;
  const totalFuel = S.fuel.reduce((s, f) => s + f.total, 0);
  const totalMaint = S.maintenance.reduce((s, m) => s + m.total, 0);
  const totalExp = S.expenses.reduce((s, e) => s + e.amount, 0) + totalFuel + totalMaint;
  const totalFuelL = S.fuel.reduce((s, f) => s + f.liters, 0);

  const mc = document.getElementById('mainContent');
  mc.innerHTML = `
    <div class="mb-6">
      <h1 class="font-display text-2xl lg:text-3xl font-bold mb-1">${t('welcome')}, ${S.user.name.split(' ')[0]}</h1>
      <p class="text-sm" style="color:var(--fg-muted)">Here's what's happening with your fleet today</p>
    </div>

    <!-- KPI ROW 1 -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
      ${kpiCard(t('totalVehicles'), totalV, '+2 this month', 'up', IC.vehicles, '#f59e0b')}
      ${kpiCard(t('activeVehicles'), activeV, `${Math.round(activeV/totalV*100)}% of fleet`, 'up', IC.tracking, '#10b981')}
      ${kpiCard(t('inMaintenance'), maintV, '1 overdue', 'down', IC.maintenance, '#f97316')}
      ${kpiCard(t('totalDrivers'), totalD, `${activeD} active`, 'up', IC.drivers, '#06b6d4')}
    </div>

    <!-- KPI ROW 2 -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      ${kpiCard(t('movingVehicles'), moving, 'live now', 'up', '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>', '#10b981')}
      ${kpiCard(t('stoppedVehicles'), stopped, `${idle} idle`, 'neutral', '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>', '#ef4444')}
      ${kpiCard(t('offlineVehicles'), offline, 'check devices', 'down', '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 1l22 22M16.72 11.06A10.94 10.94 0 0123 12M11.05 5.94A10.94 10.94 0 0113 6M3.34 7.34A10.94 10.94 0 015 6M2 12c0 3 2 6 6 6 3 0 5-3 5-6"/></svg>', '#64748b')}
      ${kpiCard(t('totalTrips'), S.trips.length, 'this month', 'up', IC.trips, '#8b5cf6')}
    </div>

    <!-- CHARTS ROW 1 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
      <div class="card p-4 lg:col-span-2">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="font-display font-semibold">Fuel & Maintenance Cost Trend</h3>
            <p class="text-xs" style="color:var(--fg-muted)">Last 8 months</p>
          </div>
          <div class="flex items-center gap-3 text-xs">
            <div class="flex items-center gap-1.5"><div class="w-2.5 h-2.5 rounded-full" style="background:#f59e0b"></div>Fuel</div>
            <div class="flex items-center gap-1.5"><div class="w-2.5 h-2.5 rounded-full" style="background:#f97316"></div>Maintenance</div>
          </div>
        </div>
        <canvas id="chartFuelTrend" height="100"></canvas>
      </div>
      <div class="card p-4">
        <h3 class="font-display font-semibold mb-1">Fleet Status</h3>
        <p class="text-xs mb-4" style="color:var(--fg-muted)">Real-time distribution</p>
        <canvas id="chartFleetStatus" height="160"></canvas>
      </div>
    </div>

    <!-- CHARTS ROW 2 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
      <div class="card p-4">
        <h3 class="font-display font-semibold mb-1">Vehicle Utilization</h3>
        <p class="text-xs mb-4" style="color:var(--fg-muted)">Active vs idle hours</p>
        <canvas id="chartUtilization" height="160"></canvas>
      </div>
      <div class="card p-4">
        <h3 class="font-display font-semibold mb-1">Monthly Expenses</h3>
        <p class="text-xs mb-4" style="color:var(--fg-muted)">All categories (ETB)</p>
        <canvas id="chartExpenses" height="160"></canvas>
      </div>
      <div class="card p-4">
        <h3 class="font-display font-semibold mb-1">Driver Performance</h3>
        <p class="text-xs mb-4" style="color:var(--fg-muted)">Top 5 drivers by score</p>
        <canvas id="chartDrivers" height="160"></canvas>
      </div>
    </div>

    <!-- ALERTS + UPCOMING -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div class="card p-4">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-display font-semibold">Recent Alerts</h3>
          <button class="text-xs" style="color:var(--accent)" onclick="setPage('notifications')">View all →</button>
        </div>
        <div class="space-y-2">
          ${S.notifications.slice(0,5).map(n => `
            <div class="flex items-start gap-3 p-2.5 rounded-lg" style="background:var(--bg-elev)">
              <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style="background:${n.severity==='danger'?'rgba(239,68,68,.15)':n.severity==='warning'?'rgba(234,179,8,.15)':'rgba(6,182,212,.15)'}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${n.severity==='danger'?'#f87171':n.severity==='warning'?'#facc15':'#22d3ee'}" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><path d="M12 9v4M12 17h.01"/></svg>
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-sm font-medium truncate">${n.title}</div>
                <div class="text-xs truncate" style="color:var(--fg-muted)">${n.message}</div>
                <div class="text-xs mt-1" style="color:var(--fg-soft)">${timeAgo(n.time)}</div>
              </div>
              ${!n.read ? '<div class="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0 mt-2"></div>' : ''}
            </div>
          `).join('')}
        </div>
      </div>

      <div class="card p-4">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-display font-semibold">Upcoming Maintenance & Documents</h3>
          <button class="text-xs" style="color:var(--accent)" onclick="setPage('maintenance')">View all →</button>
        </div>
        <div class="space-y-2">
          ${S.maintenance.filter(m => new Date(m.nextDate) > new Date()).slice(0,4).map(m => {
            const days = daysFromNow(m.nextDate);
            return `<div class="flex items-center gap-3 p-2.5 rounded-lg" style="background:var(--bg-elev)">
              <div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background:rgba(249,115,22,.15)">${IC.maintenance.replace('currentColor','#fb923c')}</div>
              <div class="flex-1 min-w-0">
                <div class="text-sm font-medium">${m.vehicle} — ${m.type}</div>
                <div class="text-xs" style="color:var(--fg-muted)">Due in ${days} days · ${fmtDate(m.nextDate)}</div>
              </div>
              <span class="badge ${days<7?'badge-warning':'badge-neutral'}">${days}d</span>
            </div>`;
          }).join('')}
          ${S.documents.filter(d => d.status !== 'valid').slice(0,3).map(d => `
            <div class="flex items-center gap-3 p-2.5 rounded-lg" style="background:var(--bg-elev)">
              <div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background:${d.status==='expired'?'rgba(239,68,68,.15)':'rgba(234,179,8,.15)'}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${d.status==='expired'?'#f87171':'#facc15'}" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-sm font-medium">${d.vehicle} — ${d.type}</div>
                <div class="text-xs" style="color:var(--fg-muted)">${d.status === 'expired' ? 'Expired' : 'Expires'} ${fmtDate(d.expiry)}</div>
              </div>
              <span class="badge ${d.status==='expired'?'badge-danger':'badge-warning'}">${d.status}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- KPI ROW 3 - Costs -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
      ${kpiCard(t('fuelConsumption'), fmtNum(totalFuelL) + ' L', fmtMoney(totalFuel), 'neutral', IC.fuel, '#f59e0b')}
      ${kpiCard(t('fuelCost'), fmtMoney(totalFuel), `${S.fuel.length} transactions`, 'up', IC.expenses, '#fbbf24')}
      ${kpiCard(t('maintenanceCost'), fmtMoney(totalMaint), `${S.maintenance.length} records`, 'down', IC.maintenance, '#f97316')}
      ${kpiCard(t('totalExpenses'), fmtMoney(totalExp), 'this quarter', 'up', IC.reports, '#10b981')}
    </div>
  `;

  // Render charts
  setTimeout(() => {
    const textColor = S.theme === 'dark' ? '#94a3b8' : '#475569';
    const gridColor = S.theme === 'dark' ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.05)';
    
    // Fuel Trend
    S.charts.fuelTrend = new Chart(document.getElementById('chartFuelTrend'), {
      type: 'line',
      data: {
        labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug'],
        datasets: [
          { label:'Fuel', data:[42000,44000,41000,47000,52000,48000,53000,58000], borderColor:'#f59e0b', backgroundColor:'rgba(245,158,11,.12)', tension:.4, fill:true, borderWidth:2.5, pointRadius:0, pointHoverRadius:5 },
          { label:'Maintenance', data:[12000,18000,9000,15000,22000,14000,17000,24000], borderColor:'#f97316', backgroundColor:'rgba(249,115,22,.08)', tension:.4, fill:true, borderWidth:2.5, pointRadius:0, pointHoverRadius:5 }
        ]
      },
      options: chartBaseOpts(textColor, gridColor)
    });

    // Fleet Status
    S.charts.fleetStatus = new Chart(document.getElementById('chartFleetStatus'), {
      type: 'doughnut',
      data: {
        labels: ['Moving','Idle','Stopped','Maintenance','Offline'],
        datasets: [{ data:[moving,idle,stopped,maintV,offline], backgroundColor:['#10b981','#eab308','#ef4444','#f97316','#64748b'], borderWidth:0 }]
      },
      options: { ...chartBaseOpts(textColor, gridColor), cutout:'68%', plugins:{legend:{position:'bottom',labels:{boxWidth:10,padding:12,color:textColor,font:{size:11}}}} }
    });

    // Utilization
    S.charts.utilization = new Chart(document.getElementById('chartUtilization'), {
      type: 'bar',
      data: { labels:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], datasets:[{ label:'Active hours', data:[68,72,80,75,82,45,30], backgroundColor:'#10b981', borderRadius:6 }, { label:'Idle hours', data:[12,8,15,10,12,25,8], backgroundColor:'#eab308', borderRadius:6 }] },
      options: { ...chartBaseOpts(textColor, gridColor), plugins:{legend:{display:false}} }
    });

    // Expenses
    S.charts.expenses = new Chart(document.getElementById('chartExpenses'), {
      type: 'bar',
      data: { labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug'], datasets:[{ data:[78000,82000,75000,91000,105000,98000,112000,128000], backgroundColor:'#f59e0b', borderRadius:6, barThickness:18 }] },
      options: { ...chartBaseOpts(textColor, gridColor), plugins:{legend:{display:false}} }
    });

    // Drivers
    const topDrivers = [...S.drivers].sort((a,b) => b.score - a.score).slice(0,5);
    S.charts.drivers = new Chart(document.getElementById('chartDrivers'), {
      type: 'bar',
      data: { labels: topDrivers.map(d => d.name.split(' ')[0]), datasets:[{ label:'Score', data: topDrivers.map(d => d.score), backgroundColor:'#06b6d4', borderRadius:6, barThickness:22 }] },
      options: { ...chartBaseOpts(textColor, gridColor), indexAxis:'y', plugins:{legend:{display:false}} }
    });
  }, 50);
}

function kpiCard(label, value, sub, trend, icon, color) {
  const trendIcon = trend==='up' ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M23 6l-9.5 9.5-5-5L1 18"/></svg>'
    : trend==='down' ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M23 18l-9.5-9.5-5 5L1 6"/></svg>'
    : '';
  const trendColor = trend==='up'?'kpi-trend-up':trend==='down'?'kpi-trend-down':'';
  return `<div class="card p-4 hover:border-amber-500/30 transition-colors">
    <div class="flex items-start justify-between mb-3">
      <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background:${color}22;color:${color}">${icon}</div>
      <div class="flex items-center gap-1 text-xs ${trendColor}">${trendIcon}</div>
    </div>
    <div class="text-2xl font-display font-bold mb-0.5">${value}</div>
    <div class="text-xs" style="color:var(--fg-muted)">${label}</div>
    <div class="text-xs mt-1.5" style="color:var(--fg-soft)">${sub}</div>
  </div>`;
}

function chartBaseOpts(textColor, gridColor) {
  return {
    responsive: true,
    maintainAspectRatio: true,
    plugins: { legend: { display: true, labels: { color: textColor, font:{size:11}, boxWidth:10, padding:12 } } },
    scales: {
      x: { ticks: { color: textColor, font:{size:10} }, grid: { color: gridColor, drawBorder:false } },
      y: { ticks: { color: textColor, font:{size:10} }, grid: { color: gridColor, drawBorder:false } }
    }
  };
}

function timeAgo(iso) {
  const d = (Date.now() - new Date(iso).getTime()) / 1000;
  if (d < 60) return 'just now';
  if (d < 3600) return Math.floor(d/60) + 'm ago';
  if (d < 86400) return Math.floor(d/3600) + 'h ago';
  return Math.floor(d/86400) + 'd ago';
}

/* ============================================================
   LIVE TRACKING
   ============================================================ */
function renderLiveTracking() {
  document.getElementById('mainContent').innerHTML = `
    <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="font-display text-2xl font-bold mb-1">${t('liveTracking')}</h1>
        <p class="text-sm" style="color:var(--fg-muted)">Real-time fleet positions · Updates every second</p>
      </div>
      <div class="flex items-center gap-2">
        <select id="statusFilter" class="input" style="width:auto" onchange="filterMapVehicles()">
          <option value="all">All Vehicles</option>
          <option value="moving">Moving</option>
          <option value="idle">Idle</option>
          <option value="stopped">Stopped</option>
          <option value="offline">Offline</option>
          <option value="maintenance">Maintenance</option>
        </select>
        <button class="btn-ghost" onclick="centerMap()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
          Center
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
      <div class="lg:col-span-3">
        <div class="card p-1 relative" style="height:calc(100vh - 200px);min-height:500px">
          <div id="map" style="width:100%;height:100%;border-radius:13px"></div>
          <div class="map-legend">
            <div class="legend-item"><div class="legend-dot" style="background:#10b981"></div>Moving</div>
            <div class="legend-item"><div class="legend-dot" style="background:#eab308"></div>Idle</div>
            <div class="legend-item"><div class="legend-dot" style="background:#ef4444"></div>Stopped</div>
            <div class="legend-item"><div class="legend-dot" style="background:#f97316"></div>Maintenance</div>
            <div class="legend-item"><div class="legend-dot" style="background:#64748b"></div>Offline</div>
          </div>
        </div>
      </div>
      <div class="card p-3 flex flex-col" style="height:calc(100vh - 200px);min-height:500px">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-display font-semibold text-sm">Vehicle List</h3>
          <span class="badge badge-success">${S.vehicles.filter(v=>v.status==='moving').length} live</span>
        </div>
        <input id="vehicleSearch" class="input mb-3" placeholder="Search vehicle..." oninput="filterMapVehicles()">
        <div id="vehicleList" class="flex-1 overflow-y-auto space-y-1.5 -mr-2 pr-2"></div>
      </div>
    </div>
  `;

  initMap();
  renderVehicleList();
}

function initMap() {
  if (S.map) { try { S.map.remove(); } catch(e){} S.map = null; }
  S.vehicleMarkers = {};
  S.trails = {};
  
  S.map = L.map('map', { zoomControl:true, attributionControl:true }).setView([9.0320, 38.7463], 12);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap, © CARTO',
    maxZoom: 19
  }).addTo(S.map);

  // Geofence circles
  S.geofences.forEach(g => {
    L.circle([g.lat, g.lng], { radius: g.radius, color:'#f59e0b', fillColor:'#f59e0b', fillOpacity:0.06, weight:1.5 }).addTo(S.map).bindTooltip(g.name);
  });

  // Vehicle markers
  S.vehicles.forEach(v => addOrUpdateVehicleMarker(v));
  setTimeout(centerMap, 200);
}

function addOrUpdateVehicleMarker(v) {
  const icon = L.divIcon({
    className: '',
    html: `<div class="vehicle-marker ${v.status}">${v.reg.split('-')[1].slice(0,3)}</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18]
  });

  if (S.vehicleMarkers[v.id]) {
    S.vehicleMarkers[v.id].setLatLng([v.lat, v.lng]);
    S.vehicleMarkers[v.id].setIcon(icon);
  } else {
    const marker = L.marker([v.lat, v.lng], { icon }).addTo(S.map);
    marker.on('click', () => selectVehicle(v.id));
    S.vehicleMarkers[v.id] = marker;
  }
  S.vehicleMarkers[v.id].bindPopup(`
    <div style="min-width:200px">
      <div style="font-weight:700;font-size:14px;margin-bottom:4px">${v.reg}</div>
      <div style="font-size:12px;color:#94a3b8;margin-bottom:8px">${v.make} ${v.model}</div>
      <div style="display:grid;grid-template-columns:auto 1fr;gap:4px 12px;font-size:11px">
        <span style="color:#94a3b8">Status:</span><span style="text-transform:capitalize">${v.status}</span>
        <span style="color:#94a3b8">Speed:</span><span>${Math.round(v.speed)} km/h</span>
        <span style="color:#94a3b8">Fuel:</span><span>${v.fuelLevel}%</span>
        <span style="color:#94a3b8">Ignition:</span><span>${v.ignition?'ON':'OFF'}</span>
        <span style="color:#94a3b8">Driver:</span><span>${(S.drivers.find(d=>d.id===v.driverId)||{}).name || '—'}</span>
      </div>
    </div>
  `);
}

function selectVehicle(id) {
  S.selectedVehicle = id;
  Object.entries(S.vehicleMarkers).forEach(([vid, marker]) => {
    const el = marker.getElement();
    if (el) el.querySelector('.vehicle-marker')?.classList.toggle('selected', vid === id);
  });
  renderVehicleList();
  const v = S.vehicles.find(x => x.id === id);
  if (v && S.map) S.map.setView([v.lat, v.lng], 15, { animate:true });
}

function centerMap() {
  if (S.map) S.map.setView([9.0320, 38.7463], 12);
}

function renderVehicleList() {
  const container = document.getElementById('vehicleList');
  if (!container) return;
  const search = (document.getElementById('vehicleSearch')?.value || '').toLowerCase();
  const statusFilter = document.getElementById('statusFilter')?.value || 'all';
  const filtered = S.vehicles.filter(v => {
    if (search && !v.reg.toLowerCase().includes(search) && !`${v.make} ${v.model}`.toLowerCase().includes(search)) return false;
    if (statusFilter !== 'all' && v.status !== statusFilter) return false;
    return true;
  });
  container.innerHTML = filtered.map(v => `
    <div class="p-2.5 rounded-lg cursor-pointer transition-colors ${S.selectedVehicle===v.id?'':'hover:bg-white/5'}" 
         style="${S.selectedVehicle===v.id?'background:var(--accent-soft);border:1px solid rgba(245,158,11,.3)':'border:1px solid transparent'}"
         onclick="selectVehicle('${v.id}')">
      <div class="flex items-center justify-between mb-1">
        <div class="text-sm font-semibold">${v.reg}</div>
        <span class="badge badge-${v.status==='moving'?'success':v.status==='idle'?'warning':v.status==='stopped'?'danger':v.status==='maintenance'?'orange':'neutral'}">${v.status}</span>
      </div>
      <div class="text-xs" style="color:var(--fg-muted)">${v.make} ${v.model}</div>
      <div class="flex items-center justify-between mt-1.5 text-xs" style="color:var(--fg-soft)">
        <span>${Math.round(v.speed)} km/h</span>
        <span>${v.fuelLevel}% fuel</span>
      </div>
    </div>
  `).join('') || '<div class="text-xs text-center py-4" style="color:var(--fg-muted)">No vehicles match</div>';
}

function filterMapVehicles() { renderVehicleList(); }

/* ---------- GPS SIMULATION ---------- */
function startGPSSimulation() {
  if (S.gpsTimer) return;
  S.gpsTimer = setInterval(() => {
    S.vehicles.forEach(v => {
      if (v.status === 'moving') {
        // Move along route
        const target = v.route[v.routeIdx + 1] || v.route[v.routeIdx - 1];
        if (target) {
          const dx = target[0] - v.lat;
          const dy = target[1] - v.lng;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 0.002) {
            v.routeIdx = (v.routeIdx + 1) % v.route.length;
          } else {
            v.lat += (dx / dist) * 0.0008;
            v.lng += (dy / dist) * 0.0008;
          }
          v.heading = Math.atan2(dy, dx) * 180 / Math.PI;
          v.speed = Math.max(15, Math.min(85, v.speed + rand(-8, 8)));
          v.fuelLevel = Math.max(15, v.fuelLevel - 0.02);
        }
      } else if (v.status === 'idle') {
        v.speed = 0;
        v.fuelLevel = Math.max(15, v.fuelLevel - 0.005);
      } else if (v.status === 'stopped' || v.status === 'maintenance' || v.status === 'offline') {
        v.speed = 0;
      }
      v.lastUpdate = new Date().toISOString();
      
      // Update marker position
      if (S.vehicleMarkers[v.id]) {
        S.vehicleMarkers[v.id].setLatLng([v.lat, v.lng]);
        addOrUpdateVehicleMarker(v);
      }
    });
    
    // If on tracking page, refresh vehicle list statuses (not positions)
    if (S.page === 'liveTracking') {
      // Lightweight list update
      document.querySelectorAll('#vehicleList > div').forEach((el, i) => {
        const v = S.vehicles[i];
        if (v) {
          const speedEl = el.querySelector('.flex.items-center.justify-between.mt-1.5 span:first-child');
          if (speedEl) speedEl.textContent = `${Math.round(v.speed)} km/h`;
        }
      });
    }
  }, 1500);
}
function stopGPSSimulation() { if (S.gpsTimer) { clearInterval(S.gpsTimer); S.gpsTimer = null; } }

/* ============================================================
   VEHICLES
   ============================================================ */
function renderVehicles() {
  document.getElementById('mainContent').innerHTML = `
    <div class="flex flex-wrap items-center justify-between gap-3 mb-5">
      <div>
        <h1 class="font-display text-2xl font-bold mb-1">${t('vehicles')}</h1>
        <p class="text-sm" style="color:var(--fg-muted)">${S.vehicles.length} vehicles in fleet</p>
      </div>
      <button class="btn-primary" onclick="vehicleModal()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
        ${t('addVehicle')}
      </button>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
      <div class="card p-3"><div class="text-xs" style="color:var(--fg-muted)">Total</div><div class="font-display text-xl font-bold mt-1">${S.vehicles.length}</div></div>
      <div class="card p-3"><div class="text-xs" style="color:var(--fg-muted)">Active</div><div class="font-display text-xl font-bold mt-1" style="color:#34d399">${S.vehicles.filter(v=>v.status==='moving'||v.status==='idle').length}</div></div>
      <div class="card p-3"><div class="text-xs" style="color:var(--fg-muted)">Maintenance</div><div class="font-display text-xl font-bold mt-1" style="color:#fb923c">${S.vehicles.filter(v=>v.status==='maintenance').length}</div></div>
      <div class="card p-3"><div class="text-xs" style="color:var(--fg-muted)">Offline</div><div class="font-display text-xl font-bold mt-1" style="color:#94a3b8">${S.vehicles.filter(v=>v.status==='offline').length}</div></div>
    </div>

    <div class="card overflow-hidden">
      <div class="p-3 border-b flex flex-wrap items-center gap-2" style="border-color:var(--border)">
        <input id="vsearch" class="input max-w-xs" placeholder="Search by reg, make, model..." oninput="filterVehicles()">
        <select class="input" style="width:auto" id="vtypeFilter" onchange="filterVehicles()">
          <option value="all">All Types</option>
          <option>Sedan</option><option>SUV</option><option>Pickup</option><option>Truck</option><option>Bus</option><option>Van</option>
        </select>
        <select class="input" style="width:auto" id="vstatusFilter" onchange="filterVehicles()">
          <option value="all">All Status</option>
          <option>moving</option><option>idle</option><option>stopped</option><option>maintenance</option><option>offline</option>
        </select>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead><tr class="text-left text-xs uppercase" style="color:var(--fg-muted)">
            <th class="p-3">Vehicle</th><th class="p-3">Type</th><th class="p-3">Driver</th><th class="p-3">Dept</th><th class="p-3">Mileage</th><th class="p-3">Fuel</th><th class="p-3">Status</th><th class="p-3 text-right">Actions</th>
          </tr></thead>
          <tbody id="vehicleTableBody"></tbody>
        </table>
      </div>
    </div>
  `;
  filterVehicles();
}

function filterVehicles() {
  const s = (document.getElementById('vsearch')?.value || '').toLowerCase();
  const t = document.getElementById('vtypeFilter')?.value || 'all';
  const st = document.getElementById('vstatusFilter')?.value || 'all';
  const filtered = S.vehicles.filter(v => {
    if (s && !`${v.reg} ${v.make} ${v.model}`.toLowerCase().includes(s)) return false;
    if (t !== 'all' && v.type !== t) return false;
    if (st !== 'all' && v.status !== st) return false;
    return true;
  });
  document.getElementById('vehicleTableBody').innerHTML = filtered.map(v => {
    const d = S.drivers.find(x => x.id === v.driverId);
    return `<tr class="table-row border-t" style="border-color:var(--border)" onclick="vehicleDetail('${v.id}')">
      <td class="p-3"><div class="font-semibold">${v.reg}</div><div class="text-xs" style="color:var(--fg-muted)">${v.make} ${v.model} · ${v.year}</div></td>
      <td class="p-3">${v.type}</td>
      <td class="p-3">${d?d.name:'—'}</td>
      <td class="p-3">${v.dept}</td>
      <td class="p-3">${fmtNum(v.mileage,0)} km</td>
      <td class="p-3">${v.fuelLevel}%</td>
      <td class="p-3"><span class="badge badge-${v.status==='moving'?'success':v.status==='idle'?'warning':v.status==='stopped'?'danger':v.status==='maintenance'?'orange':'neutral'}">${v.status}</span></td>
      <td class="p-3 text-right" onclick="event.stopPropagation()">
        <button class="btn-ghost p-1.5" onclick="vehicleDetail('${v.id}')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button>
        <button class="btn-ghost p-1.5" onclick="vehicleModal('${v.id}')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
        <button class="btn-danger p-1.5" onclick="confirmDialog('Delete vehicle ${v.reg}?', () => deleteVehicle('${v.id}'))"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg></button>
      </td>
    </tr>`;
  }).join('') || '<tr><td colspan="8" class="p-8 text-center" style="color:var(--fg-muted)">No vehicles found</td></tr>';
}

function vehicleModal(id) {
  const v = id ? S.vehicles.find(x => x.id === id) : null;
  openModal(
    v ? 'Edit Vehicle' : t('addVehicle'),
    `<form id="vehicleForm" class="grid grid-cols-2 gap-4">
      <div><label class="label">Registration Number *</label><input name="reg" class="input" value="${v?v.reg:''}" required placeholder="AA-12345"></div>
      <div><label class="label">VIN/Chassis</label><input name="vin" class="input" value="${v?v.vin:''}"></div>
      <div><label class="label">Make *</label><input name="make" class="input" value="${v?v.make:''}" required></div>
      <div><label class="label">Model *</label><input name="model" class="input" value="${v?v.model:''}" required></div>
      <div><label class="label">Year</label><input name="year" type="number" class="input" value="${v?v.year:''}"></div>
      <div><label class="label">Type</label><select name="type" class="input"><option>Sedan</option><option>SUV</option><option>Pickup</option><option>Truck</option><option>Bus</option><option>Van</option><option>Motorcycle</option></select></div>
      <div><label class="label">Color</label><input name="color" class="input" value="${v?v.color:''}"></div>
      <div><label class="label">Engine Number</label><input name="engine" class="input" value="${v?v.engine:''}"></div>
      <div><label class="label">Fuel Type</label><select name="fuelType" class="input"><option>Diesel</option><option>Petrol</option><option>Hybrid</option><option>Electric</option></select></div>
      <div><label class="label">Tank Capacity (L)</label><input name="tankCapacity" type="number" class="input" value="${v?v.tankCapacity:''}"></div>
      <div><label class="label">Current Mileage</label><input name="mileage" type="number" class="input" value="${v?v.mileage:''}"></div>
      <div><label class="label">Department</label><select name="dept" class="input">${S.departments.map(d=>`<option ${v&&v.dept===d?'selected':''}>${d}</option>`).join('')}</select></div>
      <div><label class="label">Branch</label><select name="branch" class="input">${S.branches.map(b=>`<option ${v&&v.branch===b?'selected':''}>${b}</option>`).join('')}</select></div>
      <div><label class="label">Assigned Driver</label><select name="driverId" class="input"><option value="">—</option>${S.drivers.map(d=>`<option value="${d.id}" ${v&&v.driverId===d.id?'selected':''}>${d.name}</option>`).join('')}</select></div>
      <div><label class="label">Status</label><select name="status" class="input"><option>moving</option><option>idle</option><option>stopped</option><option>maintenance</option><option>offline</option></select></div>
    </form>`,
    `<button class="btn-ghost" onclick="closeModal()">${t('cancel')}</button><button class="btn-primary" onclick="saveVehicle('${id||''}')">${t('save')}</button>`,
    'lg'
  );
  if (v) {
    document.querySelector('[name="type"]').value = v.type;
    document.querySelector('[name="fuelType"]').value = v.fuelType;
    document.querySelector('[name="status"]').value = v.status;
  }
}

function saveVehicle(id) {
  const form = document.getElementById('vehicleForm');
  const fd = new FormData(form);
  const data = Object.fromEntries(fd);
  if (!data.reg) { toast('Registration required', 'danger'); return; }
  
  if (id) {
    const v = S.vehicles.find(x => x.id === id);
    Object.assign(v, data);
    v.tankCapacity = +v.tankCapacity; v.mileage = +v.mileage; v.year = +v.year;
    logAudit('Updated vehicle ' + v.reg, 'vehicle');
    toast(t('updated'));
  } else {
    const newV = { ...data, id: 'V' + (1000 + S.vehicles.length + 1), tankCapacity: +data.tankCapacity, mileage: +data.mileage, year: +data.year,
      lat: 9.032, lng: 38.746, speed: 0, fuelLevel: 100, ignition: false, lastUpdate: new Date().toISOString(),
      route: ADDIS_ROUTES[S.vehicles.length % ADDIS_ROUTES.length], routeIdx: 0 };
    S.vehicles.push(newV);
    logAudit('Created vehicle ' + newV.reg, 'vehicle');
    toast(t('created'));
  }
  closeModal();
  renderVehicles();
}

function deleteVehicle(id) {
  S.vehicles = S.vehicles.filter(v => v.id !== id);
  toast(t('deleted'));
  renderVehicles();
}

function vehicleDetail(id) {
  const v = S.vehicles.find(x => x.id === id);
  if (!v) return;
  const d = S.drivers.find(x => x.id === v.driverId);
  const vTrips = S.trips.filter(x => x.vehicleId === v.id);
  const vFuel = S.fuel.filter(x => x.vehicleId === v.id);
  const vMaint = S.maintenance.filter(x => x.vehicleId === v.id);
  const vDocs = S.documents.filter(x => x.vehicle === v.reg);
  
  openModal(v.reg + ' — ' + v.make + ' ' + v.model, `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
      <div class="md:col-span-2 card-soft p-4">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1a1006" stroke-width="2"><path d="M5 17H3v-5l2-5h11l2 5v5h-2"/><circle cx="7.5" cy="17.5" r="2"/><circle cx="15.5" cy="17.5" r="2"/></svg></div>
          <div>
            <div class="font-display text-xl font-bold">${v.reg}</div>
            <div class="text-sm" style="color:var(--fg-muted)">${v.make} ${v.model} · ${v.year} · ${v.color}</div>
          </div>
          <span class="badge badge-${v.status==='moving'?'success':v.status==='idle'?'warning':v.status==='stopped'?'danger':v.status==='maintenance'?'orange':'neutral'} ml-auto">${v.status}</span>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div><div class="text-xs" style="color:var(--fg-muted)">Type</div><div class="font-medium">${v.type}</div></div>
          <div><div class="text-xs" style="color:var(--fg-muted)">Fuel Type</div><div class="font-medium">${v.fuelType}</div></div>
          <div><div class="text-xs" style="color:var(--fg-muted)">Tank</div><div class="font-medium">${v.tankCapacity} L</div></div>
          <div><div class="text-xs" style="color:var(--fg-muted)">Mileage</div><div class="font-medium">${fmtNum(v.mileage,0)} km</div></div>
          <div><div class="text-xs" style="color:var(--fg-muted)">Department</div><div class="font-medium">${v.dept}</div></div>
          <div><div class="text-xs" style="color:var(--fg-muted)">Branch</div><div class="font-medium">${v.branch}</div></div>
          <div><div class="text-xs" style="color:var(--fg-muted)">VIN</div><div class="font-medium text-xs">${v.vin}</div></div>
          <div><div class="text-xs" style="color:var(--fg-muted)">Engine</div><div class="font-medium text-xs">${v.engine}</div></div>
        </div>
      </div>
      <div class="card-soft p-4">
        <div class="text-xs mb-3" style="color:var(--fg-muted)">Live GPS Position</div>
        <div class="space-y-2 text-xs">
          <div class="flex justify-between"><span style="color:var(--fg-muted)">Latitude</span><span class="font-mono">${v.lat.toFixed(5)}</span></div>
          <div class="flex justify-between"><span style="color:var(--fg-muted)">Longitude</span><span class="font-mono">${v.lng.toFixed(5)}</span></div>
          <div class="flex justify-between"><span style="color:var(--fg-muted)">Speed</span><span>${Math.round(v.speed)} km/h</span></div>
          <div class="flex justify-between"><span style="color:var(--fg-muted)">Fuel Level</span><span>${v.fuelLevel}%</span></div>
          <div class="flex justify-between"><span style="color:var(--fg-muted)">Ignition</span><span>${v.ignition?'ON':'OFF'}</span></div>
          <div class="flex justify-between"><span style="color:var(--fg-muted)">GPS Device</span><span>${v.gpsDevice}</span></div>
        </div>
      </div>
    </div>

    <div class="flex flex-wrap gap-2 mb-4">
      <button class="tab-btn active" onclick="vehicleTab(event,'overview')">Overview</button>
      <button class="tab-btn" onclick="vehicleTab(event,'trips')">Trips (${vTrips.length})</button>
      <button class="tab-btn" onclick="vehicleTab(event,'fuel')">Fuel (${vFuel.length})</button>
      <button class="tab-btn" onclick="vehicleTab(event,'maint')">Maintenance (${vMaint.length})</button>
      <button class="tab-btn" onclick="vehicleTab(event,'docs')">Documents (${vDocs.length})</button>
      <button class="tab-btn" onclick="vehicleTab(event,'driver')">Driver</button>
    </div>

    <div id="vehicleTabContent"></div>
  `, '', 'xl');
  vehicleTab(null, 'overview');
}

function vehicleTab(e, tab) {
  if (e) document.querySelectorAll('#modalMount .tab-btn').forEach(b => b.classList.remove('active'));
  if (e) e.target.classList.add('active');
  else document.querySelectorAll('#modalMount .tab-btn').forEach((b,i) => b.classList.toggle('active', i===0));
  
  const id = document.querySelector('#modalMount h3').textContent.split(' ')[0];
  const v = S.vehicles.find(x => x.reg === id) || S.vehicles.find(x => x.id === id);
  const content = document.getElementById('vehicleTabContent');
  
  if (tab === 'overview') {
    content.innerHTML = `<div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div class="card-soft p-3"><div class="text-xs" style="color:var(--fg-muted)">Total Trips</div><div class="font-display text-lg font-bold">${(S.trips.filter(t=>t.vehicleId===v.id)).length}</div></div>
      <div class="card-soft p-3"><div class="text-xs" style="color:var(--fg-muted)">Total Distance</div><div class="font-display text-lg font-bold">${fmtNum(S.trips.filter(t=>t.vehicleId===v.id).reduce((s,t)=>s+t.distance,0),0)} km</div></div>
      <div class="card-soft p-3"><div class="text-xs" style="color:var(--fg-muted)">Fuel Cost</div><div class="font-display text-lg font-bold">${fmtMoney(S.fuel.filter(f=>f.vehicleId===v.id).reduce((s,f)=>s+f.total,0))}</div></div>
      <div class="card-soft p-3"><div class="text-xs" style="color:var(--fg-muted)">Maint. Cost</div><div class="font-display text-lg font-bold">${fmtMoney(S.maintenance.filter(m=>m.vehicleId===v.id).reduce((s,m)=>s+m.total,0))}</div></div>
    </div>`;
  } else if (tab === 'trips') {
    content.innerHTML = simpleTable(['Trip','From','To','Date','Distance','Status'], 
      S.trips.filter(t => t.vehicleId === v.id).map(t => [t.id, t.start, t.destination, fmtDate(t.startDate), t.distance+' km', t.status]));
  } else if (tab === 'fuel') {
    content.innerHTML = simpleTable(['Date','Station','Liters','Cost','Odometer'],
      S.fuel.filter(f => f.vehicleId === v.id).map(f => [fmtDate(f.date), f.station, f.liters+' L', fmtMoney(f.total), f.odometer+' km']));
  } else if (tab === 'maint') {
    content.innerHTML = simpleTable(['Date','Type','Provider','Total','Next'],
      S.maintenance.filter(m => m.vehicleId === v.id).map(m => [fmtDate(m.date), m.type, m.provider, fmtMoney(m.total), fmtDate(m.nextDate)]));
  } else if (tab === 'docs') {
    content.innerHTML = simpleTable(['Type','Expiry','Status'],
      S.documents.filter(d => d.vehicle === v.reg).map(d => [d.type, fmtDate(d.expiry), `<span class="badge badge-${d.status==='valid'?'success':d.status==='expired'?'danger':'warning'}">${d.status}</span>`]));
  } else if (tab === 'driver') {
    const d = S.drivers.find(x => x.id === v.driverId);
    if (!d) content.innerHTML = '<div class="text-sm py-4 text-center" style="color:var(--fg-muted)">No driver assigned</div>';
    else content.innerHTML = `<div class="card-soft p-4"><div class="flex items-center gap-3 mb-3"><div class="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center font-bold text-white">${d.name.split(' ').map(w=>w[0]).join('')}</div><div><div class="font-semibold">${d.name}</div><div class="text-xs" style="color:var(--fg-muted)">${d.email} · ${d.phone}</div></div></div><div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm"><div><div class="text-xs" style="color:var(--fg-muted)">License</div><div>${d.license}</div></div><div><div class="text-xs" style="color:var(--fg-muted)">Category</div><div>${d.licenseCat}</div></div><div><div class="text-xs" style="color:var(--fg-muted)">Trips</div><div>${d.trips}</div></div><div><div class="text-xs" style="color:var(--fg-muted)">Score</div><div>${d.score}/100</div></div></div></div>`;
  }
}

function simpleTable(headers, rows) {
  if (!rows.length) return '<div class="text-sm py-8 text-center" style="color:var(--fg-muted)">No records found</div>';
  return `<div class="overflow-x-auto"><table class="w-full text-sm"><thead><tr class="text-left text-xs uppercase" style="color:var(--fg-muted)">${headers.map(h=>`<th class="p-2.5">${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr class="border-t" style="border-color:var(--border-soft)">${r.map(c=>`<td class="p-2.5">${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}

/* ============================================================
   DRIVERS
   ============================================================ */
function renderDrivers() {
  document.getElementById('mainContent').innerHTML = `
    <div class="flex flex-wrap items-center justify-between gap-3 mb-5">
      <div><h1 class="font-display text-2xl font-bold mb-1">${t('drivers')}</h1><p class="text-sm" style="color:var(--fg-muted)">${S.drivers.length} drivers registered</p></div>
      <button class="btn-primary" onclick="driverModal()"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>${t('addDriver')}</button>
    </div>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
      <div class="card p-3"><div class="text-xs" style="color:var(--fg-muted)">Total</div><div class="font-display text-xl font-bold mt-1">${S.drivers.length}</div></div>
      <div class="card p-3"><div class="text-xs" style="color:var(--fg-muted)">Active</div><div class="font-display text-xl font-bold mt-1" style="color:#34d399">${S.drivers.filter(d=>d.status==='active').length}</div></div>
      <div class="card p-3"><div class="text-xs" style="color:var(--fg-muted)">On Leave</div><div class="font-display text-xl font-bold mt-1" style="color:#facc15">${S.drivers.filter(d=>d.status==='on_leave').length}</div></div>
      <div class="card p-3"><div class="text-xs" style="color:var(--fg-muted)">Avg Score</div><div class="font-display text-xl font-bold mt-1" style="color:#22d3ee">${Math.round(S.drivers.reduce((s,d)=>s+d.score,0)/S.drivers.length)}</div></div>
    </div>
    <div class="card overflow-hidden">
      <div class="p-3 border-b" style="border-color:var(--border)"><input id="dsearch" class="input max-w-xs" placeholder="Search drivers..." oninput="filterDrivers()"></div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead><tr class="text-left text-xs uppercase" style="color:var(--fg-muted)">
            <th class="p-3">Driver</th><th class="p-3">License</th><th class="p-3">Phone</th><th class="p-3">Dept</th><th class="p-3">Vehicle</th><th class="p-3">Trips</th><th class="p-3">Score</th><th class="p-3">Status</th><th class="p-3 text-right">Actions</th>
          </tr></thead>
          <tbody id="driverTableBody"></tbody>
        </table>
      </div>
    </div>
  `;
  filterDrivers();
}

function filterDrivers() {
  const s = (document.getElementById('dsearch')?.value || '').toLowerCase();
  const filtered = S.drivers.filter(d => !s || d.name.toLowerCase().includes(s) || d.phone.includes(s));
  document.getElementById('driverTableBody').innerHTML = filtered.map(d => {
    const v = S.vehicles.find(x => x.id === d.assignedVehicle);
    return `<tr class="table-row border-t" style="border-color:var(--border)" onclick="driverDetail('${d.id}')">
      <td class="p-3"><div class="flex items-center gap-2"><div class="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-xs font-bold text-white">${d.name.split(' ').map(w=>w[0]).join('')}</div><div><div class="font-semibold">${d.name}</div><div class="text-xs" style="color:var(--fg-muted)">${d.email}</div></div></div></td>
      <td class="p-3"><div>${d.license}</div><div class="text-xs" style="color:var(--fg-muted)">Cat ${d.licenseCat} · Exp ${fmtDate(d.licenseExpiry)}</div></td>
      <td class="p-3">${d.phone}</td>
      <td class="p-3">${d.dept}</td>
      <td class="p-3">${v?v.reg:'—'}</td>
      <td class="p-3">${d.trips}</td>
      <td class="p-3"><div class="flex items-center gap-2"><div class="flex-1 max-w-[60px] h-1.5 rounded-full" style="background:var(--bg-elev)"><div class="h-full rounded-full" style="width:${d.score}%;background:${d.score>85?'#10b981':d.score>70?'#eab308':'#ef4444'}"></div></div><span class="text-xs font-semibold">${d.score}</span></div></td>
      <td class="p-3"><span class="badge badge-${d.status==='active'?'success':d.status==='on_leave'?'warning':d.status==='suspended'?'danger':'neutral'}">${d.status.replace('_',' ')}</span></td>
      <td class="p-3 text-right" onclick="event.stopPropagation()">
        <button class="btn-ghost p-1.5" onclick="driverModal('${d.id}')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
        <button class="btn-danger p-1.5" onclick="confirmDialog('Delete driver ${d.name}?', () => deleteDriver('${d.id}'))"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg></button>
      </td>
    </tr>`;
  }).join('') || '<tr><td colspan="9" class="p-8 text-center" style="color:var(--fg-muted)">No drivers found</td></tr>';
}

function driverModal(id) {
  const d = id ? S.drivers.find(x => x.id === id) : null;
  openModal(d ? 'Edit Driver' : t('addDriver'),
    `<form id="driverForm" class="grid grid-cols-2 gap-4">
      <div class="col-span-2"><label class="label">Full Name *</label><input name="name" class="input" value="${d?d.name:''}" required></div>
      <div><label class="label">Phone *</label><input name="phone" class="input" value="${d?d.phone:''}" required placeholder="+2519..."></div>
      <div><label class="label">Email</label><input name="email" type="email" class="input" value="${d?d.email:''}"></div>
      <div class="col-span-2"><label class="label">Address</label><input name="address" class="input" value="${d?d.address:''}"></div>
      <div><label class="label">License Number *</label><input name="license" class="input" value="${d?d.license:''}" required></div>
      <div><label class="label">License Category</label><select name="licenseCat" class="input"><option>A</option><option>B</option><option>B1</option><option>B2</option><option>C</option><option>D</option><option>E</option></select></div>
      <div><label class="label">License Issue Date</label><input name="licenseIssue" type="date" class="input" value="${d?d.licenseIssue:''}"></div>
      <div><label class="label">License Expiry Date</label><input name="licenseExpiry" type="date" class="input" value="${d?d.licenseExpiry:''}"></div>
      <div><label class="label">Employment Date</label><input name="employed" type="date" class="input" value="${d?d.employed:''}"></div>
      <div><label class="label">Department</label><select name="dept" class="input">${S.departments.map(dp=>`<option ${d&&d.dept===dp?'selected':''}>${dp}</option>`).join('')}</select></div>
      <div><label class="label">Assigned Vehicle</label><select name="assignedVehicle" class="input"><option value="">—</option>${S.vehicles.map(v=>`<option value="${v.id}" ${d&&d.assignedVehicle===v.id?'selected':''}>${v.reg}</option>`).join('')}</select></div>
      <div><label class="label">Status</label><select name="status" class="input"><option>active</option><option>on_leave</option><option>suspended</option><option>inactive</option></select></div>
      <div><label class="label">Emergency Contact</label><input name="emergency" class="input" value="${d?d.emergency:''}"></div>
    </form>`,
    `<button class="btn-ghost" onclick="closeModal()">${t('cancel')}</button><button class="btn-primary" onclick="saveDriver('${id||''}')">${t('save')}</button>`,
    'lg'
  );
  if (d) {
    document.querySelector('[name="licenseCat"]').value = d.licenseCat;
    document.querySelector('[name="status"]').value = d.status;
  }
}

function saveDriver(id) {
  const fd = Object.fromEntries(new FormData(document.getElementById('driverForm')));
  if (!fd.name || !fd.phone) { toast('Name and phone required', 'danger'); return; }
  if (id) {
    Object.assign(S.drivers.find(x => x.id === id), fd);
    logAudit('Updated driver ' + fd.name, 'driver');
    toast(t('updated'));
  } else {
    S.drivers.push({ ...fd, id: 'D' + (2000 + S.drivers.length + 1), trips:0, distance:0, speedingEvents:0, harshBraking:0, harshAccel:0, idlingTime:0, accidents:0, score:100 });
    logAudit('Created driver ' + fd.name, 'driver');
    toast(t('created'));
  }
  closeModal(); renderDrivers();
}

function deleteDriver(id) { S.drivers = S.drivers.filter(d => d.id !== id); toast(t('deleted')); renderDrivers(); }

function driverDetail(id) {
  const d = S.drivers.find(x => x.id === id);
  if (!d) return;
  const v = S.vehicles.find(x => x.id === d.assignedVehicle);
  openModal(d.name, `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
      <div class="card-soft p-4 md:col-span-2">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-white font-bold text-lg">${d.name.split(' ').map(w=>w[0]).join('')}</div>
          <div><div class="font-display text-xl font-bold">${d.name}</div><div class="text-sm" style="color:var(--fg-muted)">${d.email} · ${d.phone}</div></div>
          <span class="badge badge-${d.status==='active'?'success':d.status==='on_leave'?'warning':'neutral'} ml-auto">${d.status.replace('_',' ')}</span>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
          <div><div class="text-xs" style="color:var(--fg-muted)">License</div><div>${d.license}</div></div>
          <div><div class="text-xs" style="color:var(--fg-muted)">Category</div><div>${d.licenseCat}</div></div>
          <div><div class="text-xs" style="color:var(--fg-muted)">License Expiry</div><div>${fmtDate(d.licenseExpiry)}</div></div>
          <div><div class="text-xs" style="color:var(--fg-muted)">Department</div><div>${d.dept}</div></div>
          <div><div class="text-xs" style="color:var(--fg-muted)">Employed Since</div><div>${fmtDate(d.employed)}</div></div>
          <div><div class="text-xs" style="color:var(--fg-muted)">Assigned Vehicle</div><div>${v?v.reg:'—'}</div></div>
        </div>
      </div>
      <div class="card-soft p-4">
        <div class="text-xs mb-3" style="color:var(--fg-muted)">Performance Score</div>
        <div class="font-display text-4xl font-bold mb-2" style="color:${d.score>85?'#34d399':d.score>70?'#facc15':'#f87171'}">${d.score}</div>
        <div class="h-2 rounded-full mb-3" style="background:var(--bg-elev)"><div class="h-full rounded-full" style="width:${d.score}%;background:${d.score>85?'#10b981':d.score>70?'#eab308':'#ef4444'}"></div></div>
        <div class="text-xs" style="color:var(--fg-muted)">${d.score>85?'Excellent':d.score>70?'Good':'Needs improvement'}</div>
      </div>
    </div>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div class="card-soft p-3"><div class="text-xs" style="color:var(--fg-muted)">Total Trips</div><div class="font-display text-lg font-bold">${d.trips}</div></div>
      <div class="card-soft p-3"><div class="text-xs" style="color:var(--fg-muted)">Distance</div><div class="font-display text-lg font-bold">${fmtNum(d.distance,0)} km</div></div>
      <div class="card-soft p-3"><div class="text-xs" style="color:var(--fg-muted)">Speeding Events</div><div class="font-display text-lg font-bold" style="color:#f87171">${d.speedingEvents}</div></div>
      <div class="card-soft p-3"><div class="text-xs" style="color:var(--fg-muted)">Harsh Braking</div><div class="font-display text-lg font-bold" style="color:#facc15">${d.harshBraking}</div></div>
      <div class="card-soft p-3"><div class="text-xs" style="color:var(--fg-muted)">Harsh Accel</div><div class="font-display text-lg font-bold" style="color:#facc15">${d.harshAccel}</div></div>
      <div class="card-soft p-3"><div class="text-xs" style="color:var(--fg-muted)">Idle Time (min)</div><div class="font-display text-lg font-bold">${d.idlingTime}</div></div>
      <div class="card-soft p-3"><div class="text-xs" style="color:var(--fg-muted)">Accidents</div><div class="font-display text-lg font-bold" style="color:#f87171">${d.accidents}</div></div>
      <div class="card-soft p-3"><div class="text-xs" style="color:var(--fg-muted)">Emergency</div><div class="text-xs font-medium">${d.emergency}</div></div>
    </div>
  `, '', 'lg');
}

/* ============================================================
   TRIPS
   ============================================================ */
function renderTrips() {
  document.getElementById('mainContent').innerHTML = `
    <div class="flex flex-wrap items-center justify-between gap-3 mb-5">
      <div><h1 class="font-display text-2xl font-bold mb-1">${t('trips')}</h1><p class="text-sm" style="color:var(--fg-muted)">${S.trips.length} trips recorded</p></div>
      <button class="btn-primary" onclick="tripModal()"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>${t('addTrip')}</button>
    </div>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
      <div class="card p-3"><div class="text-xs" style="color:var(--fg-muted)">Completed</div><div class="font-display text-xl font-bold mt-1" style="color:#34d399">${S.trips.filter(t=>t.status==='completed').length}</div></div>
      <div class="card p-3"><div class="text-xs" style="color:var(--fg-muted)">In Progress</div><div class="font-display text-xl font-bold mt-1" style="color:#22d3ee">${S.trips.filter(t=>t.status==='in_progress').length}</div></div>
      <div class="card p-3"><div class="text-xs" style="color:var(--fg-muted)">Scheduled</div><div class="font-display text-xl font-bold mt-1" style="color:#facc15">${S.trips.filter(t=>t.status==='scheduled').length}</div></div>
      <div class="card p-3"><div class="text-xs" style="color:var(--fg-muted)">Total Distance</div><div class="font-display text-xl font-bold mt-1">${fmtNum(S.trips.reduce((s,t)=>s+t.distance,0),0)} km</div></div>
    </div>
    <div class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead><tr class="text-left text-xs uppercase" style="color:var(--fg-muted)">
            <th class="p-3">Trip ID</th><th class="p-3">Vehicle</th><th class="p-3">Driver</th><th class="p-3">Route</th><th class="p-3">Date</th><th class="p-3">Distance</th><th class="p-3">Duration</th><th class="p-3">Purpose</th><th class="p-3">Status</th><th class="p-3 text-right">Actions</th>
          </tr></thead>
          <tbody>${S.trips.map(tr => `
            <tr class="table-row border-t" style="border-color:var(--border)">
              <td class="p-3 font-mono text-xs">${tr.id}</td>
              <td class="p-3 font-semibold">${tr.vehicle}</td>
              <td class="p-3">${tr.driver}</td>
              <td class="p-3"><div class="text-xs">${tr.start}</div><div class="text-xs" style="color:var(--fg-muted)">→ ${tr.destination}</div></td>
              <td class="p-3">${fmtDate(tr.startDate)}</td>
              <td class="p-3">${tr.distance} km</td>
              <td class="p-3">${tr.duration}m</td>
              <td class="p-3 text-xs">${tr.purpose}</td>
              <td class="p-3"><span class="badge badge-${tr.status==='completed'?'success':tr.status==='in_progress'?'info':tr.status==='scheduled'?'warning':'neutral'}">${tr.status.replace('_',' ')}</span></td>
              <td class="p-3 text-right" onclick="event.stopPropagation()">
                <button class="btn-ghost p-1.5" onclick="tripModal('${tr.id}')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                <button class="btn-danger p-1.5" onclick="confirmDialog('Delete trip ${tr.id}?', () => deleteTrip('${tr.id}'))"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg></button>
              </td>
            </tr>`).join('')}</tbody>
        </table>
      </div>
    </div>
  `;
}

function tripModal(id) {
  const tr = id ? S.trips.find(x => x.id === id) : null;
  openModal(tr ? 'Edit Trip' : t('addTrip'),
    `<form id="tripForm" class="grid grid-cols-2 gap-4">
      <div><label class="label">Vehicle *</label><select name="vehicleId" class="input" required>${S.vehicles.map(v=>`<option value="${v.id}" data-reg="${v.reg}" ${tr&&tr.vehicleId===v.id?'selected':''}>${v.reg} - ${v.make}</option>`).join('')}</select></div>
      <div><label class="label">Driver *</label><select name="driverId" class="input" required>${S.drivers.map(d=>`<option value="${d.id}" data-name="${d.name}" ${tr&&tr.driverId===d.id?'selected':''}>${d.name}</option>`).join('')}</select></div>
      <div><label class="label">Start Location</label><input name="start" class="input" value="${tr?tr.start:''}" placeholder="Pickup location"></div>
      <div><label class="label">Destination</label><input name="destination" class="input" value="${tr?tr.destination:''}" placeholder="Drop-off"></div>
      <div><label class="label">Start Date/Time</label><input name="startDate" type="datetime-local" class="input" value="${tr?new Date(tr.startDate).toISOString().slice(0,16):''}"></div>
      <div><label class="label">End Date/Time</label><input name="endDate" type="datetime-local" class="input" value="${tr?new Date(tr.endDate).toISOString().slice(0,16):''}"></div>
      <div><label class="label">Distance (km)</label><input name="distance" type="number" class="input" value="${tr?tr.distance:''}"></div>
      <div><label class="label">Purpose</label><select name="purpose" class="input"><option>Cargo Delivery</option><option>Customer Visit</option><option>Field Inspection</option><option>Passenger Transport</option><option>Maintenance Run</option><option>Airport Pickup</option><option>Office Errand</option></select></div>
      <div><label class="label">Cargo/Passenger Info</label><input name="cargo" class="input" value="${tr?tr.cargo:''}"></div>
      <div><label class="label">Status</label><select name="status" class="input"><option>scheduled</option><option>in_progress</option><option>completed</option><option>cancelled</option></select></div>
      <div class="col-span-2"><label class="label">Notes</label><textarea name="notes" class="input" rows="2">${tr?tr.notes:''}</textarea></div>
    </form>`,
    `<button class="btn-ghost" onclick="closeModal()">${t('cancel')}</button><button class="btn-primary" onclick="saveTrip('${id||''}')">${t('save')}</button>`,
    'lg'
  );
  if (tr) { document.querySelector('[name="purpose"]').value = tr.purpose; document.querySelector('[name="status"]').value = tr.status; }
}

function saveTrip(id) {
  const fd = new FormData(document.getElementById('tripForm'));
  const data = Object.fromEntries(fd);
  const v = S.vehicles.find(x => x.id === data.vehicleId);
  const d = S.drivers.find(x => x.id === data.driverId);
  data.vehicle = v?.reg; data.driver = d?.name;
  data.distance = +data.distance;
  if (id) {
    Object.assign(S.trips.find(x => x.id === id), data);
    logAudit('Updated trip ' + id, 'trip');
    toast(t('updated'));
  } else {
    data.id = 'TRP-' + uid().toUpperCase().slice(0,6);
    if (data.startDate && data.endDate) {
      data.duration = Math.round((new Date(data.endDate) - new Date(data.startDate)) / 60000);
      if (data.duration > 0 && data.distance) data.avgSpeed = Math.round(data.distance / (data.duration/60));
    }
    S.trips.unshift(data);
    logAudit('Created trip ' + data.id, 'trip');
    toast(t('created'));
  }
  closeModal(); renderTrips();
}
function deleteTrip(id) { S.trips = S.trips.filter(t => t.id !== id); toast(t('deleted')); renderTrips(); }

/* ============================================================
   FUEL
   ============================================================ */
function renderFuel() {
  const totalL = S.fuel.reduce((s,f) => s+f.liters, 0);
  const totalCost = S.fuel.reduce((s,f) => s+f.total, 0);
  const avgPrice = totalL ? totalCost/totalL : 0;
  document.getElementById('mainContent').innerHTML = `
    <div class="flex flex-wrap items-center justify-between gap-3 mb-5">
      <div><h1 class="font-display text-2xl font-bold mb-1">${t('fuel')} Management</h1><p class="text-sm" style="color:var(--fg-muted)">${S.fuel.length} fuel transactions</p></div>
      <button class="btn-primary" onclick="fuelModal()"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>${t('addFuel')}</button>
    </div>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
      <div class="card p-3"><div class="text-xs" style="color:var(--fg-muted)">Total Liters</div><div class="font-display text-xl font-bold mt-1">${fmtNum(totalL,0)} L</div></div>
      <div class="card p-3"><div class="text-xs" style="color:var(--fg-muted)">Total Cost</div><div class="font-display text-xl font-bold mt-1" style="color:#fbbf24">${fmtMoney(totalCost)}</div></div>
      <div class="card p-3"><div class="text-xs" style="color:var(--fg-muted)">Avg Price/L</div><div class="font-display text-xl font-bold mt-1">ETB ${avgPrice.toFixed(2)}</div></div>
      <div class="card p-3"><div class="text-xs" style="color:var(--fg-muted)">This Month</div><div class="font-display text-xl font-bold mt-1" style="color:#34d399">${S.fuel.filter(f => new Date(f.date) > new Date(Date.now() - 30*86400000)).length}</div></div>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
      <div class="card p-4 lg:col-span-2">
        <h3 class="font-display font-semibold mb-3">Fuel Consumption Trend</h3>
        <canvas id="chartFuelConsumption" height="100"></canvas>
      </div>
      <div class="card p-4">
        <h3 class="font-display font-semibold mb-3">Fuel by Type</h3>
        <canvas id="chartFuelType" height="160"></canvas>
      </div>
    </div>
    <div class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead><tr class="text-left text-xs uppercase" style="color:var(--fg-muted)">
            <th class="p-3">Date</th><th class="p-3">Vehicle</th><th class="p-3">Driver</th><th class="p-3">Station</th><th class="p-3">Type</th><th class="p-3">Liters</th><th class="p-3">Price/L</th><th class="p-3">Total</th><th class="p-3">Odometer</th><th class="p-3 text-right">Actions</th>
          </tr></thead>
          <tbody>${S.fuel.slice(0,15).map(f => `
            <tr class="table-row border-t" style="border-color:var(--border)">
              <td class="p-3">${fmtDate(f.date)}</td>
              <td class="p-3 font-semibold">${f.vehicle}</td>
              <td class="p-3">${f.driver}</td>
              <td class="p-3">${f.station}</td>
              <td class="p-3"><span class="badge badge-${f.fuelType==='Diesel'?'orange':'info'}">${f.fuelType}</span></td>
              <td class="p-3">${f.liters} L</td>
              <td class="p-3">ETB ${f.pricePerL.toFixed(2)}</td>
              <td class="p-3 font-semibold">${fmtMoney(f.total)}</td>
              <td class="p-3">${fmtNum(f.odometer,0)} km</td>
              <td class="p-3 text-right" onclick="event.stopPropagation()">
                <button class="btn-ghost p-1.5" onclick="fuelModal('${f.id}')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                <button class="btn-danger p-1.5" onclick="confirmDialog('Delete fuel record?', () => deleteFuel('${f.id}'))"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg></button>
              </td>
            </tr>`).join('')}</tbody>
        </table>
      </div>
    </div>
  `;
  setTimeout(() => {
    const textColor = S.theme === 'dark' ? '#94a3b8' : '#475569';
    const gridColor = S.theme === 'dark' ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.05)';
    S.charts.fc = new Chart(document.getElementById('chartFuelConsumption'), {
      type: 'line',
      data: { labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug'], datasets: [{ label:'Liters', data:[420,480,510,460,540,510,580,620], borderColor:'#f59e0b', backgroundColor:'rgba(245,158,11,.12)', fill:true, tension:.4, borderWidth:2.5, pointRadius:0 }] },
      options: chartBaseOpts(textColor, gridColor)
    });
    const diesel = S.fuel.filter(f => f.fuelType === 'Diesel').reduce((s,f) => s+f.liters, 0);
    const petrol = S.fuel.filter(f => f.fuelType === 'Petrol').reduce((s,f) => s+f.liters, 0);
    S.charts.ft = new Chart(document.getElementById('chartFuelType'), {
      type: 'doughnut',
      data: { labels:['Diesel','Petrol'], datasets:[{ data:[diesel,petrol], backgroundColor:['#f97316','#06b6d4'], borderWidth:0 }] },
      options: { ...chartBaseOpts(textColor, gridColor), cutout:'65%', plugins:{legend:{position:'bottom',labels:{boxWidth:10,padding:12,color:textColor,font:{size:11}}}} }
    });
  }, 50);
}

function fuelModal(id) {
  const f = id ? S.fuel.find(x => x.id === id) : null;
  openModal(f ? 'Edit Fuel Transaction' : t('addFuel'),
    `<form id="fuelForm" class="grid grid-cols-2 gap-4">
      <div><label class="label">Vehicle *</label><select name="vehicleId" class="input" required>${S.vehicles.map(v=>`<option value="${v.id}" data-reg="${v.reg}" ${f&&f.vehicleId===v.id?'selected':''}>${v.reg}</option>`).join('')}</select></div>
      <div><label class="label">Driver</label><select name="driverId" class="input">${S.drivers.map(d=>`<option value="${d.id}" data-name="${d.name}" ${f&&f.driverId===d.id?'selected':''}>${d.name}</option>`).join('')}</select></div>
      <div><label class="label">Date</label><input name="date" type="datetime-local" class="input" value="${f?new Date(f.date).toISOString().slice(0,16):new Date().toISOString().slice(0,16)}"></div>
      <div><label class="label">Fuel Station</label><input name="station" class="input" value="${f?f.station:''}"></div>
      <div><label class="label">Fuel Type</label><select name="fuelType" class="input"><option>Diesel</option><option>Petrol</option><option>Other</option></select></div>
      <div><label class="label">Liters *</label><input name="liters" type="number" step="0.01" class="input" value="${f?f.liters:''}" required></div>
      <div><label class="label">Price per Liter</label><input name="pricePerL" type="number" step="0.01" class="input" value="${f?f.pricePerL:'78.54'}"></div>
      <div><label class="label">Odometer Reading</label><input name="odometer" type="number" class="input" value="${f?f.odometer:''}"></div>
      <div><label class="label">Payment Method</label><select name="method" class="input"><option>Cash</option><option>Card</option><option>Voucher</option><option>Credit</option></select></div>
      <div><label class="label">Receipt Number</label><input name="receipt" class="input" value="${f?f.receipt:''}"></div>
      <div class="col-span-2"><label class="label">Notes</label><textarea name="notes" class="input" rows="2">${f?f.notes:''}</textarea></div>
    </form>`,
    `<button class="btn-ghost" onclick="closeModal()">${t('cancel')}</button><button class="btn-primary" onclick="saveFuel('${id||''}')">${t('save')}</button>`,
    'lg'
  );
  if (f) { document.querySelector('[name="fuelType"]').value = f.fuelType; document.querySelector('[name="method"]').value = f.method; }
}

function saveFuel(id) {
  const fd = new FormData(document.getElementById('fuelForm'));
  const data = Object.fromEntries(fd);
  const v = S.vehicles.find(x => x.id === data.vehicleId);
  const d = S.drivers.find(x => x.id === data.driverId);
  data.vehicle = v?.reg; data.driver = d?.name;
  data.liters = +data.liters; data.pricePerL = +data.pricePerL; data.odometer = +data.odometer;
  data.total = data.liters * data.pricePerL;
  if (id) { Object.assign(S.fuel.find(x => x.id === id), data); logAudit('Updated fuel transaction', 'fuel'); toast(t('updated')); }
  else { data.id = 'F' + uid(); S.fuel.unshift(data); logAudit('Created fuel transaction', 'fuel'); toast(t('created')); }
  closeModal(); renderFuel();
}
function deleteFuel(id) { S.fuel = S.fuel.filter(f => f.id !== id); toast(t('deleted')); renderFuel(); }

/* ============================================================
   MAINTENANCE
   ============================================================ */
function renderMaintenance() {
  document.getElementById('mainContent').innerHTML = `
    <div class="flex flex-wrap items-center justify-between gap-3 mb-5">
      <div><h1 class="font-display text-2xl font-bold mb-1">${t('maintenance')}</h1><p class="text-sm" style="color:var(--fg-muted)">${S.maintenance.length} service records</p></div>
      <button class="btn-primary" onclick="maintModal()"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>${t('addMaintenance')}</button>
    </div>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
      <div class="card p-3"><div class="text-xs" style="color:var(--fg-muted)">Total Cost</div><div class="font-display text-xl font-bold mt-1">${fmtMoney(S.maintenance.reduce((s,m)=>s+m.total,0))}</div></div>
      <div class="card p-3"><div class="text-xs" style="color:var(--fg-muted)">Completed</div><div class="font-display text-xl font-bold mt-1" style="color:#34d399">${S.maintenance.filter(m=>m.status==='completed').length}</div></div>
      <div class="card p-3"><div class="text-xs" style="color:var(--fg-muted)">Scheduled</div><div class="font-display text-xl font-bold mt-1" style="color:#facc15">${S.maintenance.filter(m=>m.status==='scheduled').length}</div></div>
      <div class="card p-3"><div class="text-xs" style="color:var(--fg-muted)">Upcoming (30d)</div><div class="font-display text-xl font-bold mt-1" style="color:#fb923c">${S.maintenance.filter(m => new Date(m.nextDate) < new Date(Date.now()+30*86400000) && new Date(m.nextDate) > new Date()).length}</div></div>
    </div>
    <div class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead><tr class="text-left text-xs uppercase" style="color:var(--fg-muted)">
            <th class="p-3">Date</th><th class="p-3">Vehicle</th><th class="p-3">Type</th><th class="p-3">Provider</th><th class="p-3">Mileage</th><th class="p-3">Labor</th><th class="p-3">Parts</th><th class="p-3">Total</th><th class="p-3">Next Service</th><th class="p-3">Status</th><th class="p-3 text-right">Actions</th>
          </tr></thead>
          <tbody>${S.maintenance.map(m => `
            <tr class="table-row border-t" style="border-color:var(--border)">
              <td class="p-3">${fmtDate(m.date)}</td>
              <td class="p-3 font-semibold">${m.vehicle}</td>
              <td class="p-3">${m.type}</td>
              <td class="p-3">${m.provider}</td>
              <td class="p-3">${fmtNum(m.mileage,0)} km</td>
              <td class="p-3">${fmtMoney(m.labor)}</td>
              <td class="p-3">${fmtMoney(m.parts)}</td>
              <td class="p-3 font-semibold">${fmtMoney(m.total)}</td>
              <td class="p-3">${fmtDate(m.nextDate)}</td>
              <td class="p-3"><span class="badge badge-${m.status==='completed'?'success':m.status==='in_progress'?'info':m.status==='scheduled'?'warning':'neutral'}">${m.status.replace('_',' ')}</span></td>
              <td class="p-3 text-right" onclick="event.stopPropagation()">
                <button class="btn-ghost p-1.5" onclick="maintModal('${m.id}')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                <button class="btn-danger p-1.5" onclick="confirmDialog('Delete maintenance record?', () => deleteMaint('${m.id}'))"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg></button>
              </td>
            </tr>`).join('')}</tbody>
        </table>
      </div>
    </div>
  `;
}

function maintModal(id) {
  const m = id ? S.maintenance.find(x => x.id === id) : null;
  openModal(m ? 'Edit Maintenance' : t('addMaintenance'),
    `<form id="maintForm" class="grid grid-cols-2 gap-4">
      <div><label class="label">Vehicle *</label><select name="vehicleId" class="input" required>${S.vehicles.map(v=>`<option value="${v.id}" data-reg="${v.reg}" ${m&&m.vehicleId===v.id?'selected':''}>${v.reg}</option>`).join('')}</select></div>
      <div><label class="label">Type</label><select name="type" class="input"><option>Oil Change</option><option>Tire Replacement</option><option>Brake Service</option><option>Engine Service</option><option>Battery</option><option>Transmission</option><option>Suspension</option><option>Electrical</option><option>Inspection</option><option>General Service</option><option>Other</option></select></div>
      <div><label class="label">Date</label><input name="date" type="date" class="input" value="${m?m.date.slice(0,10):new Date().toISOString().slice(0,10)}"></div>
      <div><label class="label">Mileage at Service</label><input name="mileage" type="number" class="input" value="${m?m.mileage:''}"></div>
      <div><label class="label">Service Provider</label><input name="provider" class="input" value="${m?m.provider:''}"></div>
      <div><label class="label">Labor Cost (ETB)</label><input name="labor" type="number" class="input" value="${m?m.labor:''}"></div>
      <div><label class="label">Parts Cost (ETB)</label><input name="parts" type="number" class="input" value="${m?m.parts:''}"></div>
      <div><label class="label">Next Service Date</label><input name="nextDate" type="date" class="input" value="${m?m.nextDate.slice(0,10):''}"></div>
      <div><label class="label">Next Service Mileage</label><input name="nextMileage" type="number" class="input" value="${m?m.nextMileage:''}"></div>
      <div><label class="label">Status</label><select name="status" class="input"><option>scheduled</option><option>in_progress</option><option>completed</option></select></div>
      <div class="col-span-2"><label class="label">Description</label><textarea name="description" class="input" rows="2">${m?m.description:''}</textarea></div>
    </form>`,
    `<button class="btn-ghost" onclick="closeModal()">${t('cancel')}</button><button class="btn-primary" onclick="saveMaint('${id||''}')">${t('save')}</button>`,
    'lg'
  );
  if (m) { document.querySelector('[name="type"]').value = m.type; document.querySelector('[name="status"]').value = m.status; }
}

function saveMaint(id) {
  const fd = new FormData(document.getElementById('maintForm'));
  const data = Object.fromEntries(fd);
  const v = S.vehicles.find(x => x.id === data.vehicleId);
  data.vehicle = v?.reg;
  data.labor = +data.labor; data.parts = +data.parts; data.mileage = +data.mileage; data.nextMileage = +data.nextMileage;
  data.total = data.labor + data.parts;
  if (id) { Object.assign(S.maintenance.find(x => x.id === id), data); logAudit('Updated maintenance record', 'maintenance'); toast(t('updated')); }
  else { data.id = 'M' + uid(); S.maintenance.unshift(data); logAudit('Created maintenance record', 'maintenance'); toast(t('created')); }
  closeModal(); renderMaintenance();
}
function deleteMaint(id) { S.maintenance = S.maintenance.filter(m => m.id !== id); toast(t('deleted')); renderMaintenance(); }

/* ============================================================
   EXPENSES
   ============================================================ */
function renderExpenses() {
  const total = S.expenses.reduce((s,e) => s+e.amount, 0);
  const byCat = {};
  S.expenses.forEach(e => { byCat[e.category] = (byCat[e.category] || 0) + e.amount; });
  document.getElementById('mainContent').innerHTML = `
    <div class="flex flex-wrap items-center justify-between gap-3 mb-5">
      <div><h1 class="font-display text-2xl font-bold mb-1">${t('expenses')}</h1><p class="text-sm" style="color:var(--fg-muted)">Total: ${fmtMoney(total)}</p></div>
      <button class="btn-primary" onclick="expenseModal()"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>${t('addExpense')}</button>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
      <div class="card p-4 lg:col-span-2">
        <h3 class="font-display font-semibold mb-3">Monthly Expense Trend</h3>
        <canvas id="chartExpTrend" height="100"></canvas>
      </div>
      <div class="card p-4">
        <h3 class="font-display font-semibold mb-3">By Category</h3>
        <canvas id="chartExpCat" height="160"></canvas>
      </div>
    </div>
    <div class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead><tr class="text-left text-xs uppercase" style="color:var(--fg-muted)">
            <th class="p-3">Date</th><th class="p-3">Vehicle</th><th class="p-3">Category</th><th class="p-3">Vendor</th><th class="p-3">Amount</th><th class="p-3">Description</th><th class="p-3 text-right">Actions</th>
          </tr></thead>
          <tbody>${S.expenses.slice(0,20).map(e => `
            <tr class="table-row border-t" style="border-color:var(--border)">
              <td class="p-3">${fmtDate(e.date)}</td>
              <td class="p-3 font-semibold">${e.vehicle}</td>
              <td class="p-3"><span class="badge badge-neutral">${e.category}</span></td>
              <td class="p-3">${e.vendor}</td>
              <td class="p-3 font-semibold">${fmtMoney(e.amount)}</td>
              <td class="p-3 text-xs" style="color:var(--fg-muted)">${e.description}</td>
              <td class="p-3 text-right" onclick="event.stopPropagation()">
                <button class="btn-ghost p-1.5" onclick="expenseModal('${e.id}')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                <button class="btn-danger p-1.5" onclick="confirmDialog('Delete expense?', () => deleteExpense('${e.id}'))"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg></button>
              </td>
            </tr>`).join('')}</tbody>
        </table>
      </div>
    </div>
  `;
  setTimeout(() => {
    const textColor = S.theme === 'dark' ? '#94a3b8' : '#475569';
    const gridColor = S.theme === 'dark' ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.05)';
    S.charts.et = new Chart(document.getElementById('chartExpTrend'), {
      type: 'bar',
      data: { labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug'], datasets: [{ data:[78000,82000,75000,91000,105000,98000,112000,128000], backgroundColor:'#f59e0b', borderRadius:6 }] },
      options: { ...chartBaseOpts(textColor, gridColor), plugins:{legend:{display:false}} }
    });
    S.charts.ec = new Chart(document.getElementById('chartExpCat'), {
      type: 'doughnut',
      data: { labels: Object.keys(byCat), datasets: [{ data: Object.values(byCat), backgroundColor:['#f59e0b','#f97316','#10b981','#06b6d4','#8b5cf6','#ef4444','#eab308','#64748b','#fbbf24','#22d3ee'], borderWidth:0 }] },
      options: { ...chartBaseOpts(textColor, gridColor), cutout:'60%', plugins:{legend:{position:'bottom',labels:{boxWidth:8,padding:8,color:textColor,font:{size:10}}}} }
    });
  }, 50);
}

function expenseModal(id) {
  const e = id ? S.expenses.find(x => x.id === id) : null;
  openModal(e ? 'Edit Expense' : t('addExpense'),
    `<form id="expForm" class="grid grid-cols-2 gap-4">
      <div><label class="label">Vehicle</label><select name="vehicleId" class="input">${S.vehicles.map(v=>`<option value="${v.id}" data-reg="${v.reg}" ${e&&e.vehicleId===v.id?'selected':''}>${v.reg}</option>`).join('')}</select></div>
      <div><label class="label">Driver</label><select name="driverId" class="input"><option value="">—</option>${S.drivers.map(d=>`<option value="${d.id}" data-name="${d.name}" ${e&&e.driverId===d.id?'selected':''}>${d.name}</option>`).join('')}</select></div>
      <div><label class="label">Category</label><select name="category" class="input"><option>Fuel</option><option>Maintenance</option><option>Insurance</option><option>Registration</option><option>Spare Parts</option><option>Tolls</option><option>Parking</option><option>Driver Expenses</option><option>Fines</option><option>Other</option></select></div>
      <div><label class="label">Amount (ETB) *</label><input name="amount" type="number" class="input" value="${e?e.amount:''}" required></div>
      <div><label class="label">Date</label><input name="date" type="date" class="input" value="${e?e.date.slice(0,10):new Date().toISOString().slice(0,10)}"></div>
      <div><label class="label">Vendor</label><input name="vendor" class="input" value="${e?e.vendor:''}"></div>
      <div class="col-span-2"><label class="label">Description</label><textarea name="description" class="input" rows="2">${e?e.description:''}</textarea></div>
    </form>`,
    `<button class="btn-ghost" onclick="closeModal()">${t('cancel')}</button><button class="btn-primary" onclick="saveExpense('${id||''}')">${t('save')}</button>`,
    'md'
  );
  if (e) document.querySelector('[name="category"]').value = e.category;
}

function saveExpense(id) {
  const fd = new FormData(document.getElementById('expForm'));
  const data = Object.fromEntries(fd);
  const v = S.vehicles.find(x => x.id === data.vehicleId);
  const d = S.drivers.find(x => x.id === data.driverId);
  data.vehicle = v?.reg; data.driver = d?.name; data.amount = +data.amount;
  if (id) { Object.assign(S.expenses.find(x => x.id === id), data); logAudit('Updated expense', 'expense'); toast(t('updated')); }
  else { data.id = 'E' + uid(); S.expenses.unshift(data); logAudit('Created expense', 'expense'); toast(t('created')); }
  closeModal(); renderExpenses();
}
function deleteExpense(id) { S.expenses = S.expenses.filter(e => e.id !== id); toast(t('deleted')); renderExpenses(); }

/* ============================================================
   GEOFENCES
   ============================================================ */
function renderGeofences() {
  document.getElementById('mainContent').innerHTML = `
    <div class="flex flex-wrap items-center justify-between gap-3 mb-5">
      <div><h1 class="font-display text-2xl font-bold mb-1">${t('geofences')}</h1><p class="text-sm" style="color:var(--fg-muted)">${S.geofences.length} geofence zones</p></div>
      <button class="btn-primary" onclick="toast('Geofence editor — draw on map to create zone','info')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>Add Geofence</button>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="lg:col-span-2 card p-1" style="height:500px"><div id="geoMap" style="width:100%;height:100%;border-radius:13px"></div></div>
      <div class="space-y-3">
        ${S.geofences.map(g => `
          <div class="card p-4">
            <div class="flex items-start justify-between mb-2">
              <div><div class="font-display font-semibold">${g.name}</div><div class="text-xs" style="color:var(--fg-muted)">${g.type === 'circle' ? 'Circle · ' + g.radius + 'm radius' : 'Polygon'}</div></div>
              <span class="badge badge-warning">${g.alerts}</span>
            </div>
            <div class="grid grid-cols-2 gap-2 text-xs mt-3">
              <div><div style="color:var(--fg-muted)">Vehicles</div><div class="font-semibold">${g.vehicles} assigned</div></div>
              <div><div style="color:var(--fg-muted)">Coords</div><div class="font-mono">${g.lat.toFixed(3)}, ${g.lng.toFixed(3)}</div></div>
            </div>
            <div class="flex gap-2 mt-3">
              <button class="btn-ghost flex-1 text-xs justify-center" onclick="toast('Edit geofence ${g.name}','info')">Edit</button>
              <button class="btn-danger flex-1 text-xs justify-center" onclick="confirmDialog('Delete geofence ${g.name}?', () => { S.geofences = S.geofences.filter(x => x.id !== '${g.id}'); toast('Geofence deleted'); renderGeofences(); })">Delete</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  setTimeout(() => {
    if (S.geoMap) { try { S.geoMap.remove(); } catch(e){} }
    S.geoMap = L.map('geoMap').setView([9.0320, 38.7463], 12);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { attribution:'© OpenStreetMap, © CARTO', maxZoom:19 }).addTo(S.geoMap);
    S.geofences.forEach(g => {
      L.circle([g.lat, g.lng], { radius:g.radius, color:'#f59e0b', fillColor:'#f59e0b', fillOpacity:0.12, weight:2 }).addTo(S.geoMap).bindTooltip(g.name);
    });
  }, 50);
}

/* ============================================================
   REPORTS
   ============================================================ */
function renderReports() {
  document.getElementById('mainContent').innerHTML = `
    <div class="mb-5">
      <h1 class="font-display text-2xl font-bold mb-1">${t('reports')} & Analytics</h1>
      <p class="text-sm" style="color:var(--fg-muted)">Generate detailed fleet reports</p>
    </div>
    <div class="card p-4 mb-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div><label class="label">Report Type</label><select id="repType" class="input"><option>Vehicle Utilization</option><option>Vehicle Mileage</option><option>Fuel Consumption</option><option>Fuel Cost</option><option>Driver Performance</option><option>Trip History</option><option>Maintenance Cost</option><option>Expense Report</option><option>Speed Violations</option><option>Geofence Events</option></select></div>
        <div><label class="label">From Date</label><input type="date" class="input" value="${new Date(Date.now()-30*86400000).toISOString().slice(0,10)}"></div>
        <div><label class="label">To Date</label><input type="date" class="input" value="${new Date().toISOString().slice(0,10)}"></div>
        <div><label class="label">Vehicle</label><select class="input"><option>All Vehicles</option>${S.vehicles.map(v=>`<option>${v.reg}</option>`).join('')}</select></div>
      </div>
      <div class="flex gap-2 mt-3">
        <button class="btn-primary" onclick="toast('Generating report...','info')">Generate Report</button>
        <button class="btn-ghost" onclick="toast('Exporting to PDF...','info')">Export PDF</button>
        <button class="btn-ghost" onclick="toast('Exporting to Excel...','info')">Export Excel</button>
        <button class="btn-ghost" onclick="toast('Exporting to CSV...','info')">Export CSV</button>
      </div>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
      <div class="card p-4"><h3 class="font-display font-semibold mb-3">Fleet Distance (Monthly)</h3><canvas id="repChart1" height="160"></canvas></div>
      <div class="card p-4"><h3 class="font-display font-semibold mb-3">Cost per Vehicle</h3><canvas id="repChart2" height="160"></canvas></div>
      <div class="card p-4"><h3 class="font-display font-semibold mb-3">Driver Performance Ranking</h3><canvas id="repChart3" height="160"></canvas></div>
      <div class="card p-4"><h3 class="font-display font-semibold mb-3">Fuel Efficiency (km/L)</h3><canvas id="repChart4" height="160"></canvas></div>
    </div>
    <div class="card p-4">
      <h3 class="font-display font-semibold mb-3">Top Vehicles by Total Operating Cost</h3>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead><tr class="text-left text-xs uppercase" style="color:var(--fg-muted)">
            <th class="p-3">Vehicle</th><th class="p-3">Fuel Cost</th><th class="p-3">Maintenance</th><th class="p-3">Other Expenses</th><th class="p-3">Total Cost</th><th class="p-3">Cost/km</th>
          </tr></thead>
          <tbody>
            ${S.vehicles.slice(0,7).map(v => {
              const f = S.fuel.filter(x=>x.vehicleId===v.id).reduce((s,x)=>s+x.total,0);
              const m = S.maintenance.filter(x=>x.vehicleId===v.id).reduce((s,x)=>s+x.total,0);
              const o = S.expenses.filter(x=>x.vehicleId===v.id).reduce((s,x)=>s+x.amount,0);
              const total = f + m + o;
              const cpk = v.mileage ? (total / v.mileage).toFixed(2) : '0';
              return `<tr class="border-t" style="border-color:var(--border-soft)"><td class="p-3 font-semibold">${v.reg}</td><td class="p-3">${fmtMoney(f)}</td><td class="p-3">${fmtMoney(m)}</td><td class="p-3">${fmtMoney(o)}</td><td class="p-3 font-semibold">${fmtMoney(total)}</td><td class="p-3">ETB ${cpk}/km</td></tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
  setTimeout(() => {
    const textColor = S.theme === 'dark' ? '#94a3b8' : '#475569';
    const gridColor = S.theme === 'dark' ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.05)';
    const opts = chartBaseOpts(textColor, gridColor);
    S.charts.r1 = new Chart(document.getElementById('repChart1'), { type:'bar', data:{labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug'],datasets:[{data:[12400,13200,11800,14500,15800,13900,16200,17400],backgroundColor:'#10b981',borderRadius:6}]}, options:{...opts,plugins:{legend:{display:false}}} });
    S.charts.r2 = new Chart(document.getElementById('repChart2'), { type:'bar', data:{labels:S.vehicles.slice(0,6).map(v=>v.reg.split('-')[1]),datasets:[{data:S.vehicles.slice(0,6).map(v=>S.fuel.filter(f=>f.vehicleId===v.id).reduce((s,f)=>s+f.total,0)+S.maintenance.filter(m=>m.vehicleId===v.id).reduce((s,m)=>s+m.total,0)),backgroundColor:'#f59e0b',borderRadius:6}]}, options:{...opts,plugins:{legend:{display:false}}} });
    const topD = [...S.drivers].sort((a,b)=>b.score-a.score).slice(0,5);
    S.charts.r3 = new Chart(document.getElementById('repChart3'), { type:'bar', data:{labels:topD.map(d=>d.name.split(' ')[0]),datasets:[{data:topD.map(d=>d.score),backgroundColor:'#06b6d4',borderRadius:6}]}, options:{...opts,plugins:{legend:{display:false}}} });
    S.charts.r4 = new Chart(document.getElementById('repChart4'), { type:'line', data:{labels:S.vehicles.slice(0,6).map(v=>v.reg.split('-')[1]),datasets:[{data:S.vehicles.slice(0,6).map(()=>rand(5,14)),borderColor:'#fbbf24',backgroundColor:'rgba(251,191,36,.12)',fill:true,tension:.4,borderWidth:2.5,pointRadius:4}]}, options:{...opts,plugins:{legend:{display:false}}} });
  }, 50);
}

/* ============================================================
   NOTIFICATIONS
   ============================================================ */
function renderNotifications() {
  document.getElementById('mainContent').innerHTML = `
    <div class="flex flex-wrap items-center justify-between gap-3 mb-5">
      <div><h1 class="font-display text-2xl font-bold mb-1">${t('notifications')}</h1><p class="text-sm" style="color:var(--fg-muted)">${S.notifications.filter(n=>!n.read).length} unread</p></div>
      <button class="btn-ghost" onclick="S.notifications.forEach(n=>n.read=true); renderNotifications(); updateTopbar();">Mark all read</button>
    </div>
    <div class="card divide-y" style="--tw-divide-opacity:1">
      ${S.notifications.map(n => `
        <div class="p-4 flex items-start gap-3 ${n.read?'':'bg-amber-500/5'}" style="border-color:var(--border)">
          <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style="background:${n.severity==='danger'?'rgba(239,68,68,.15)':n.severity==='warning'?'rgba(234,179,8,.15)':'rgba(6,182,212,.15)'}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${n.severity==='danger'?'#f87171':n.severity==='warning'?'#facc15':'#22d3ee'}" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><path d="M12 9v4M12 17h.01"/></svg>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1"><div class="font-semibold">${n.title}</div>${!n.read?'<div class="w-2 h-2 rounded-full bg-amber-500"></div>':''}</div>
            <div class="text-sm" style="color:var(--fg-muted)">${n.message}</div>
            <div class="text-xs mt-1" style="color:var(--fg-soft)">${timeAgo(n.time)} · ${n.type}</div>
          </div>
          ${!n.read ? `<button class="btn-ghost text-xs" onclick="markRead('${n.id}')">Mark read</button>` : ''}
        </div>
      `).join('')}
    </div>
  `;
}
function markRead(id) { const n = S.notifications.find(x => x.id === id); if (n) n.read = true; renderNotifications(); updateTopbar(); }

/* ============================================================
   DOCUMENTS
   ============================================================ */
function renderDocuments() {
  document.getElementById('mainContent').innerHTML = `
    <div class="flex flex-wrap items-center justify-between gap-3 mb-5">
      <div><h1 class="font-display text-2xl font-bold mb-1">${t('documents')}</h1><p class="text-sm" style="color:var(--fg-muted)">${S.documents.length} documents tracked</p></div>
      <button class="btn-primary" onclick="docModal()"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>Add Document</button>
    </div>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
      <div class="card p-3"><div class="text-xs" style="color:var(--fg-muted)">Valid</div><div class="font-display text-xl font-bold mt-1" style="color:#34d399">${S.documents.filter(d=>d.status==='valid').length}</div></div>
      <div class="card p-3"><div class="text-xs" style="color:var(--fg-muted)">Expiring Soon</div><div class="font-display text-xl font-bold mt-1" style="color:#facc15">${S.documents.filter(d=>d.status==='expiring').length}</div></div>
      <div class="card p-3"><div class="text-xs" style="color:var(--fg-muted)">Expired</div><div class="font-display text-xl font-bold mt-1" style="color:#f87171">${S.documents.filter(d=>d.status==='expired').length}</div></div>
      <div class="card p-3"><div class="text-xs" style="color:var(--fg-muted)">Total Tracked</div><div class="font-display text-xl font-bold mt-1">${S.documents.length}</div></div>
    </div>
    <div class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead><tr class="text-left text-xs uppercase" style="color:var(--fg-muted)"><th class="p-3">Vehicle</th><th class="p-3">Type</th><th class="p-3">Expiry Date</th><th class="p-3">Status</th><th class="p-3 text-right">Actions</th></tr></thead>
          <tbody>${S.documents.map(d => `
            <tr class="border-t" style="border-color:var(--border)">
              <td class="p-3 font-semibold">${d.vehicle}</td>
              <td class="p-3">${d.type}</td>
              <td class="p-3">${fmtDate(d.expiry)}</td>
              <td class="p-3"><span class="badge badge-${d.status==='valid'?'success':d.status==='expired'?'danger':'warning'}">${d.status}</span></td>
              <td class="p-3 text-right"><button class="btn-ghost p-1.5" onclick="toast('Document preview','info')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button></td>
            </tr>`).join('')}</tbody>
        </table>
      </div>
    </div>
  `;
}

function docModal() {
  openModal('Add Document',
    `<form id="docForm" class="grid grid-cols-2 gap-4">
      <div class="col-span-2"><label class="label">Vehicle</label><select name="vehicle" class="input">${S.vehicles.map(v=>`<option>${v.reg}</option>`).join('')}</select></div>
      <div><label class="label">Document Type</label><select name="type" class="input"><option>Registration</option><option>Insurance</option><option>Inspection</option><option>License</option><option>Purchase Document</option><option>Other</option></select></div>
      <div><label class="label">Expiry Date</label><input name="expiry" type="date" class="input"></div>
      <div class="col-span-2"><label class="label">Upload File</label><input type="file" class="input"></div>
    </form>`,
    `<button class="btn-ghost" onclick="closeModal()">${t('cancel')}</button><button class="btn-primary" onclick="saveDoc()">${t('save')}</button>`,
    'md'
  );
}

function saveDoc() {
  const fd = Object.fromEntries(new FormData(document.getElementById('docForm')));
  fd.id = 'DOC' + uid();
  fd.status = new Date(fd.expiry) < new Date() ? 'expired' : (daysFromNow(fd.expiry) < 30 ? 'expiring' : 'valid');
  S.documents.unshift(fd);
  logAudit('Added document for ' + fd.vehicle, 'document');
  toast(t('created'));
  closeModal(); renderDocuments();
}

/* ============================================================
   USERS
   ============================================================ */
function renderUsers() {
  document.getElementById('mainContent').innerHTML = `
    <div class="flex flex-wrap items-center justify-between gap-3 mb-5">
      <div><h1 class="font-display text-2xl font-bold mb-1">${t('users')} & Roles</h1><p class="text-sm" style="color:var(--fg-muted)">${S.users.length} users</p></div>
      <button class="btn-primary" onclick="userModal()"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>Add User</button>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
      ${Object.entries(ROLES).map(([k,r]) => {
        const count = S.users.filter(u => u.role === k).length;
        return `<div class="card p-4"><div class="flex items-center justify-between mb-2"><div class="font-display font-semibold">${r.label}</div><span class="badge badge-neutral">${count}</span></div><div class="text-xs" style="color:var(--fg-muted)">${r.pages.length} module access</div></div>`;
      }).join('')}
    </div>
    <div class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead><tr class="text-left text-xs uppercase" style="color:var(--fg-muted)"><th class="p-3">User</th><th class="p-3">Email</th><th class="p-3">Role</th><th class="p-3">Last Login</th><th class="p-3">Status</th><th class="p-3 text-right">Actions</th></tr></thead>
          <tbody>${S.users.map(u => `
            <tr class="border-t" style="border-color:var(--border)">
              <td class="p-3"><div class="flex items-center gap-2"><div class="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-xs font-bold text-amber-950">${u.name.split(' ').map(w=>w[0]).join('')}</div><div class="font-semibold">${u.name}</div></div></td>
              <td class="p-3 text-xs">${u.email}</td>
              <td class="p-3"><span class="badge badge-info">${ROLES[u.role].label}</span></td>
              <td class="p-3 text-xs">${timeAgo(u.lastLogin)}</td>
              <td class="p-3"><span class="badge badge-${u.status==='active'?'success':'neutral'}">${u.status}</span></td>
              <td class="p-3 text-right">
                <button class="btn-ghost p-1.5" onclick="userModal('${u.id}')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                <button class="btn-danger p-1.5" onclick="confirmDialog('Delete user ${u.name}?', () => { S.users = S.users.filter(x => x.id !== '${u.id}'); toast('User deleted'); renderUsers(); })"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg></button>
              </td>
            </tr>`).join('')}</tbody>
        </table>
      </div>
    </div>
  `;
}

function userModal(id) {
  const u = id ? S.users.find(x => x.id === id) : null;
  openModal(u ? 'Edit User' : 'Add User',
    `<form id="userForm" class="grid grid-cols-2 gap-4">
      <div class="col-span-2"><label class="label">Full Name *</label><input name="name" class="input" value="${u?u.name:''}" required></div>
      <div><label class="label">Email *</label><input name="email" type="email" class="input" value="${u?u.email:''}" required></div>
      <div><label class="label">Role</label><select name="role" class="input">${Object.entries(ROLES).map(([k,r])=>`<option value="${k}" ${u&&u.role===k?'selected':''}>${r.label}</option>`).join('')}</select></div>
      <div><label class="label">Status</label><select name="status" class="input"><option>active</option><option>inactive</option></select></div>
      <div><label class="label">Phone</label><input name="phone" class="input" value="${u?u.phone||'':''}"></div>
    </form>`,
    `<button class="btn-ghost" onclick="closeModal()">${t('cancel')}</button><button class="btn-primary" onclick="saveUser('${id||''}')">${t('save')}</button>`,
    'md'
  );
  if (u) document.querySelector('[name="status"]').value = u.status;
}

function saveUser(id) {
  const fd = Object.fromEntries(new FormData(document.getElementById('userForm')));
  if (!fd.name || !fd.email) { toast('Name and email required', 'danger'); return; }
  if (id) { Object.assign(S.users.find(x => x.id === id), fd); toast(t('updated')); }
  else { S.users.push({ ...fd, id:'U' + uid(), lastLogin: new Date().toISOString(), password: 'password123' }); logAudit('Created user ' + fd.name, 'user'); toast(t('created')); }
  closeModal(); renderUsers();
}

/* ============================================================
   SETTINGS
   ============================================================ */
function renderSettings() {
  document.getElementById('mainContent').innerHTML = `
    <div class="mb-5"><h1 class="font-display text-2xl font-bold mb-1">${t('settings')}</h1><p class="text-sm" style="color:var(--fg-muted)">System configuration</p></div>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="card p-4 lg:col-span-2">
        <h3 class="font-display font-semibold mb-3">Organization Information</h3>
        <div class="grid grid-cols-2 gap-3">
          <div class="col-span-2"><label class="label">Organization Name</label><input class="input" value="Ethio Logistics PLC"></div>
          <div><label class="label">Default Currency</label><select class="input"><option>ETB - Ethiopian Birr</option><option>USD - US Dollar</option><option>EUR - Euro</option></select></div>
          <div><label class="label">Time Zone</label><select class="input"><option>Africa/Addis_Ababa (GMT+3)</option><option>Africa/Nairobi (GMT+3)</option></select></div>
          <div><label class="label">Distance Unit</label><select class="input"><option>Kilometers</option><option>Miles</option></select></div>
          <div><label class="label">Volume Unit</label><select class="input"><option>Liters</option><option>Gallons</option></select></div>
          <div class="col-span-2"><label class="label">Address</label><input class="input" value="Bole Road, Addis Ababa, Ethiopia"></div>
          <div><label class="label">Phone</label><input class="input" value="+251 11 551 2345"></div>
          <div><label class="label">Email</label><input class="input" value="info@ethiologistics.et"></div>
        </div>
      </div>
      <div class="space-y-4">
        <div class="card p-4">
          <h3 class="font-display font-semibold mb-3">Alert Thresholds</h3>
          <div class="space-y-3">
            <div><label class="label">Overspeeding (km/h)</label><input type="number" class="input" value="80"></div>
            <div><label class="label">Idle Time (min)</label><input type="number" class="input" value="15"></div>
            <div><label class="label">Low Fuel (%)</label><input type="number" class="input" value="20"></div>
            <div><label class="label">Maintenance Due (days)</label><input type="number" class="input" value="7"></div>
          </div>
        </div>
        <div class="card p-4">
          <h3 class="font-display font-semibold mb-3">Appearance</h3>
          <div class="flex items-center justify-between mb-2"><span class="text-sm">Theme</span><button class="btn-ghost text-xs" onclick="toggleTheme()">${S.theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}</button></div>
          <div class="flex items-center justify-between"><span class="text-sm">Language</span><button class="btn-ghost text-xs" onclick="setLanguage('${S.language === 'en' ? 'am' : 'en'}')">${S.language === 'en' ? 'አማርኛ' : 'English'}</button></div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
      <div class="card p-4">
        <h3 class="font-display font-semibold mb-3">API Integrations</h3>
        <div class="space-y-3">
          <div class="flex items-center justify-between p-3 rounded-lg" style="background:var(--bg-elev)"><div><div class="text-sm font-medium">GPS Provider</div><div class="text-xs" style="color:var(--fg-muted)">Teltonika, Coban, Concox</div></div><span class="badge badge-success">Connected</span></div>
          <div class="flex items-center justify-between p-3 rounded-lg" style="background:var(--bg-elev)"><div><div class="text-sm font-medium">Email Service</div><div class="text-xs" style="color:var(--fg-muted)">SMTP / SendGrid</div></div><span class="badge badge-success">Configured</span></div>
          <div class="flex items-center justify-between p-3 rounded-lg" style="background:var(--bg-elev)"><div><div class="text-sm font-medium">SMS Gateway</div><div class="text-xs" style="color:var(--fg-muted)">Ethio Telecom / SMS</div></div><span class="badge badge-warning">Pending</span></div>
          <div class="flex items-center justify-between p-3 rounded-lg" style="background:var(--bg-elev)"><div><div class="text-sm font-medium">Map Provider</div><div class="text-xs" style="color:var(--fg-muted)">OpenStreetMap / CARTO</div></div><span class="badge badge-success">Active</span></div>
        </div>
      </div>
      <div class="card p-4">
        <h3 class="font-display font-semibold mb-3">Audit Log (Recent)</h3>
        <div class="space-y-2">
          ${S.auditLogs.map(a => `<div class="flex items-start gap-2 text-xs"><div class="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></div><div class="flex-1"><div>${a.action}</div><div style="color:var(--fg-soft)">${a.user} · ${timeAgo(a.time)} · ${a.ip}</div></div></div>`).join('')}
        </div>
      </div>
    </div>
  `;
}

function logAudit(action, entity) {
  S.auditLogs.unshift({ id:'A' + uid(), user:S.user?.name || 'System', action, entity, time:new Date().toISOString(), ip:'196.188.45.12' });
}

/* ============================================================
   CHANGE PASSWORD
   ============================================================ */
function openChangePasswordModal() {
  // Close the profile dropdown so it doesn't overlap the modal
  document.getElementById('profileMenu').classList.add('hidden');
  
  openModal('Change Password', `
    <form id="changePasswordForm" class="space-y-4">
      <div>
        <label class="label">Current Password</label>
        <input type="password" name="current" class="input" required placeholder="Enter current password">
      </div>
      <div>
        <label class="label">New Password</label>
        <input type="password" name="new" class="input" required placeholder="Enter new password">
      </div>
      <div>
        <label class="label">Confirm New Password</label>
        <input type="password" name="confirm" class="input" required placeholder="Re-enter new password">
      </div>
      <div class="text-xs p-3 rounded-lg" style="background:var(--bg-elev); color:var(--fg-muted)">
        <strong>Note:</strong> Passwords are checked against the local demo database. Changing your password here will update it for your next login.
      </div>
    </form>
  `, 
  `<button class="btn-ghost" onclick="closeModal()">Cancel</button>
   <button class="btn-primary" onclick="saveNewPassword()">Update Password</button>`, 
  'sm');
}

function saveNewPassword() {
  const form = document.getElementById('changePasswordForm');
  const fd = new FormData(form);
  const current = fd.get('current');
  const newPass = fd.get('new');
  const confirmPass = fd.get('confirm');

  // 1. Check if the current password matches the logged-in user's actual password
  const userRecord = S.users.find(u => u.email === S.user.email);
  if (!userRecord || userRecord.password !== current) {
    toast('Current password is incorrect', 'danger');
    return;
  }
  
  // 2. Check if new passwords match
  if (newPass !== confirmPass) {
    toast('New passwords do not match', 'danger');
    return;
  }
  
  // 3. Check password length
  if (newPass.length < 6) {
    toast('Password must be at least 6 characters', 'danger');
    return;
  }

  // 4. Automatically update the user's password in the "database" (S.users array)
  userRecord.password = newPass;
  
  // Log the security action
  logAudit('Changed account password', 'security');
  
  // Close modal and show success message
  closeModal();
  toast('Password updated successfully. Use the new password on your next login.', 'success', 5000);
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initDemoData();
  // Theme
  document.documentElement.classList.toggle('light', S.theme === 'light');
  document.documentElement.classList.toggle('dark', S.theme === 'dark');
  
  // Login form
  document.getElementById('loginForm').addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    if (!email || !password) { toast('Please enter credentials', 'danger'); return; }
    login(email, password); // No role specified, will check against DB
  });
  
  document.querySelectorAll('[data-role]').forEach(btn => {
    btn.addEventListener('click', () => {
      // Auto-fill the proper demo credentials for the chosen role
      const role = btn.dataset.role;
      const userRecord = S.users.find(u => u.role === role);
      if (userRecord) {
        document.getElementById('loginEmail').value = userRecord.email;
        document.getElementById('loginPassword').value = userRecord.password;
        login(userRecord.email, userRecord.password, role);
      } else {
        toast('Demo user not found for this role', 'danger');
      }
    });
  });
  
  // Restore session
  const savedUser = localStorage.getItem('fp_user');
  if (savedUser) {
    try { 
      S.user = JSON.parse(savedUser); 
      // Quick verify user still exists in DB before auto-login
      if (S.users.find(u => u.email === S.user.email)) {
        login(S.user.email, S.users.find(u => u.email === S.user.email).password); 
      } else {
        localStorage.removeItem('fp_user');
      }
    } catch(e){}
  }
});

// Global search
document.addEventListener('input', e => {
  if (e.target.id === 'globalSearch') {
    const q = e.target.value.toLowerCase();
    if (q.length < 2) return;
    // Could implement global search results dropdown here
  }
});