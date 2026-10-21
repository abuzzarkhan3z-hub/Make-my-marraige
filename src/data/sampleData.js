/**
 * Sample realistic data for Make My Marriage MVP prototype
 */

export const initialWedding = {
  id: 'wed-001',
  name: 'Ananya & Rohan’s Wedding Celebration',
  couple_names: 'Ananya Sharma & Rohan Verma',
  budget: 2500000, // ₹ 25,00,000
  currency: 'INR',
  main_date: '2026-12-18',
  created_at: '2026-01-10T10:00:00.000Z',
};

export const initialMembers = [
  { id: 'mem-1', wedding_id: 'wed-001', name: 'Ananya Sharma', role: 'Admin', email: 'ananya@example.com' },
  { id: 'mem-2', wedding_id: 'wed-001', name: 'Rohan Verma', role: 'Admin', email: 'rohan@example.com' },
  { id: 'mem-3', wedding_id: 'wed-001', name: 'Sunita Sharma (Mother)', role: 'Family Member', email: 'sunita@example.com' },
  { id: 'mem-4', wedding_id: 'wed-001', name: 'Vikram Verma (Brother)', role: 'Family Member', email: 'vikram@example.com' },
  { id: 'mem-5', wedding_id: 'wed-001', name: 'Pooja Mehta (Cousin)', role: 'Viewer', email: 'pooja@example.com' },
];

export const initialFunctions = [
  {
    id: 'fn-1',
    wedding_id: 'wed-001',
    name: 'Mehendi & Sangeet Evening',
    starts_at: '2026-12-16T17:30',
    venue: 'The Palm Meadows Courtyard, Bangalore',
    notes: 'Colorful traditional decor, DJ set & choreographed family dances.',
    status: 'Confirmed',
  },
  {
    id: 'fn-2',
    wedding_id: 'wed-001',
    name: 'Haldi Ceremony',
    starts_at: '2026-12-17T10:00',
    venue: 'Sharma Villa Lawns, Bangalore',
    notes: 'Yellow and marigold floral theme. Dress code: Shades of yellow.',
    status: 'Confirmed',
  },
  {
    id: 'fn-3',
    wedding_id: 'wed-001',
    name: 'Wedding Muhurtham & Varmala',
    starts_at: '2026-12-18T09:30',
    venue: 'Grand Heritage Palace Banquet, Bangalore',
    notes: 'Traditional rituals, shehnai artists, royal mandap design.',
    status: 'Confirmed',
  },
  {
    id: 'fn-4',
    wedding_id: 'wed-001',
    name: 'Grand Reception Dinner',
    starts_at: '2026-12-18T19:30',
    venue: 'Grand Heritage Palace Ballroom, Bangalore',
    notes: 'Gourmet banquet dinner, live acoustic music & photo booth.',
    status: 'Planned',
  },
];

export const initialExpenses = [
  {
    id: 'exp-1',
    wedding_id: 'wed-001',
    name: 'Palace Banquet Venue Booking',
    category: 'Venue',
    total_amount: 850000,
    paid_amount: 500000,
    function_id: 'fn-3',
    vendor: 'Grand Heritage Palace',
    expense_date: '2026-02-15',
    notes: 'Includes ballroom, mandap lawn, and 10 guest suites.',
  },
  {
    id: 'exp-2',
    wedding_id: 'wed-001',
    name: 'Catering & Multi-Cuisine Buffet',
    category: 'Catering',
    total_amount: 650000,
    paid_amount: 250000,
    function_id: 'fn-4',
    vendor: 'Royal Flavors Caterers',
    expense_date: '2026-03-01',
    notes: 'Estimated 350 plates with live chaat & dessert counters.',
  },
  {
    id: 'exp-3',
    wedding_id: 'wed-001',
    name: 'Bridal Lehengas & Sherwani',
    category: 'Clothing',
    total_amount: 320000,
    paid_amount: 320000,
    function_id: 'fn-3',
    vendor: 'Heritage Couture Studio',
    expense_date: '2026-03-10',
    notes: 'Fully paid after final fittings & embroidery approval.',
  },
  {
    id: 'exp-4',
    wedding_id: 'wed-001',
    name: 'Floral Mandap & Lighting Decor',
    category: 'Decoration',
    total_amount: 280000,
    paid_amount: 100000,
    function_id: 'fn-3',
    vendor: 'Aura Dream Decors',
    expense_date: '2026-03-12',
    notes: 'Advance paid. Balance due 2 days before the wedding.',
  },
  {
    id: 'exp-5',
    wedding_id: 'wed-001',
    name: 'Candid Photography & Cinematic Film',
    category: 'Photography',
    total_amount: 220000,
    paid_amount: 100000,
    function_id: 'fn-1',
    vendor: 'Shutter & Glow Films',
    expense_date: '2026-03-20',
    notes: '3-day coverage including teaser, candid album & drone shots.',
  },
  {
    id: 'exp-6',
    wedding_id: 'wed-001',
    name: 'Guest Shuttles & Bridal Vintage Car',
    category: 'Transport',
    total_amount: 75000,
    paid_amount: 0,
    function_id: 'fn-3',
    vendor: 'Prime Wheels Bangalore',
    expense_date: '2026-04-02',
    notes: 'Booking awaiting final itinerary confirmation.',
  },
];

export const initialTasks = [
  {
    id: 'task-1',
    wedding_id: 'wed-001',
    title: 'Finalize Mehendi theme music playlist',
    description: 'Coordinate with DJ Kunal on sangeet tracks and family entry songs.',
    assigned_member_id: 'mem-4',
    due_date: '2026-11-20',
    function_id: 'fn-1',
    status: 'Completed',
  },
  {
    id: 'task-2',
    wedding_id: 'wed-001',
    title: 'Confirm dessert menu tasting with caterer',
    description: 'Schedule a visit to taste kulfi counter, rasmalai, and pastries.',
    assigned_member_id: 'mem-3',
    due_date: '2026-11-25',
    function_id: 'fn-4',
    status: 'In Progress',
  },
  {
    id: 'task-3',
    wedding_id: 'wed-001',
    title: 'Order personalized sweet boxes & welcome favors',
    description: 'Need 200 boxes of assorted sweets for outstation guests.',
    assigned_member_id: 'mem-1',
    due_date: '2026-12-01',
    function_id: 'fn-3',
    status: 'Pending',
  },
  {
    id: 'task-4',
    wedding_id: 'wed-001',
    title: 'Coordinate airport pickup schedule for extended family',
    description: 'Collect arrival timings for Mumbai and Delhi relatives.',
    assigned_member_id: 'mem-4',
    due_date: '2026-12-10',
    function_id: 'fn-3',
    status: 'Pending',
  },
];

export const initialAnnouncements = [
  {
    id: 'ann-1',
    wedding_id: 'wed-001',
    message: 'Welcome everyone to the wedding planning board! Let’s keep tasks and vendors updated here.',
    author_name: 'Ananya Sharma',
    created_at: '2026-03-01T09:00:00Z',
  },
  {
    id: 'ann-2',
    wedding_id: 'wed-001',
    message: 'Mandap color palette locked: Ivory, sage greens, and blush pink florals with warm gold pillars.',
    author_name: 'Rohan Verma',
    created_at: '2026-03-15T14:30:00Z',
  },
];

export const initialInvitation = {
  id: 'inv-001',
  wedding_id: 'wed-001',
  couple_names: 'Ananya & Rohan',
  host_names: 'Sharma & Verma Families',
  function_name: 'Wedding Muhurtham & Reception',
  starts_at: '2026-12-18T10:00',
  venue: 'Grand Heritage Palace Banquet',
  address: 'No. 42, Palace Cross Road, Vasanth Nagar, Bengaluru, Karnataka 560052',
  message: 'With joyous hearts, we invite you and your family to celebrate the auspicious union of our children. Your blessings and presence mean the world to us.',
};

export const initialGuests = [
  { id: 'g-1', wedding_id: 'wed-001', name: 'Rajesh & Kavita Gupta', phone: '+919876543210' },
  { id: 'g-2', wedding_id: 'wed-001', name: 'Uncle Arvind & Family', phone: '+919812345678' },
  { id: 'g-3', wedding_id: 'wed-001', name: 'Aakash Singhania', phone: '+919845098765' },
];

export const expenseCategories = [
  'Venue',
  'Catering',
  'Clothing',
  'Decoration',
  'Photography',
  'Transport',
  'Jewelry',
  'Entertainment',
  'Gifts & Favors',
  'Other',
];
