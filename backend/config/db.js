const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-memory cache synced with persistent JSON file
let database = {
  users: [],
  foods: [],
  claims: []
};

// Seed Initial Data Generator
const getSeedData = () => {
  const salt = bcrypt.genSaltSync(10);
  const canteenPassword = bcrypt.hashSync('canteen123', salt);
  const studentPassword = bcrypt.hashSync('student123', salt);
  const ngoPassword = bcrypt.hashSync('ngo123', salt);

  const users = [
    {
      id: 'usr-admin-1',
      name: 'Central Canteen Manager',
      email: 'canteen@nowaste.com',
      password: canteenPassword,
      role: 'canteen_admin',
      canteenName: 'Main Campus Canteen',
      points: 150,
      createdAt: new Date(Date.now() - 30 * 86400000).toISOString()
    },
    {
      id: 'usr-student-1',
      name: 'Rahul Sharma',
      email: 'student@nowaste.com',
      password: studentPassword,
      role: 'student',
      points: 420,
      createdAt: new Date(Date.now() - 20 * 86400000).toISOString()
    },
    {
      id: 'usr-student-2',
      name: 'Priya Patel',
      email: 'priya@nowaste.com',
      password: studentPassword,
      role: 'student',
      points: 390,
      createdAt: new Date(Date.now() - 15 * 86400000).toISOString()
    },
    {
      id: 'usr-student-3',
      name: 'Arjun Verma',
      email: 'arjun@nowaste.com',
      password: studentPassword,
      role: 'student',
      points: 350,
      createdAt: new Date(Date.now() - 10 * 86400000).toISOString()
    },
    {
      id: 'usr-ngo-1',
      name: 'Campus Hope Foundation (NGO)',
      email: 'ngo@nowaste.com',
      password: ngoPassword,
      role: 'student', // NGOs use student/recipient flow with higher bulk claiming
      points: 580,
      createdAt: new Date(Date.now() - 25 * 86400000).toISOString()
    }
  ];

  const now = new Date();
  // Today's meal times
  const todayAt = (hours, minutes) => {
    const d = new Date();
    d.setHours(hours, minutes, 0, 0);
    // If time already passed significantly today, set it to future or relative
    return d.toISOString();
  };

  const getFutureTime = (minutesAhead) => {
    return new Date(Date.now() + minutesAhead * 60000).toISOString();
  };

  const getPastTime = (minutesAgo) => {
    return new Date(Date.now() - minutesAgo * 60000).toISOString();
  };

  const foods = [
    {
      id: 'food-001',
      name: 'Vegetable Biryani',
      description: 'Fragrant basmati rice cooked with fresh seasonal vegetables, mint, caramelized onions, and authentic spices. Served with cooling cucumber raita.',
      category: 'Main Course',
      quantity: 18,
      originalQuantity: 25,
      unit: 'portions',
      dietType: 'veg',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
      canteen: 'Main Campus Canteen',
      pickupLocation: 'Main Canteen Counter 3, Block A',
      postedAt: getPastTime(45),
      availableFrom: getPastTime(45),
      expiryTime: getFutureTime(180), // 3 hours from now
      allergenInfo: 'Contains dairy (raita). Nut-free, gluten-free.',
      status: 'AVAILABLE',
      createdBy: 'usr-admin-1'
    },
    {
      id: 'food-002',
      name: 'Lemon Rice & Crispy Papad',
      description: 'South Indian tempered lemon rice with mustard seeds, curry leaves, roasted peanuts, and green chilies. Light and flavorful.',
      category: 'Rice & Grains',
      quantity: 14,
      originalQuantity: 20,
      unit: 'portions',
      dietType: 'veg',
      image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80',
      canteen: 'Science Block Cafeteria',
      pickupLocation: 'Science Block Ground Floor, Express Pickup Desk',
      postedAt: getPastTime(30),
      availableFrom: getPastTime(30),
      expiryTime: getFutureTime(120), // 2 hours from now
      allergenInfo: 'Contains peanuts.',
      status: 'AVAILABLE',
      createdBy: 'usr-admin-1'
    },
    {
      id: 'food-003',
      name: 'Steamed Idli with Sambar & Chutney',
      description: 'Soft, fluffy steamed rice-lentil cakes paired with piping hot vegetable sambar and fresh coconut-coriander chutney.',
      category: 'Breakfast / Snack',
      quantity: 2,
      originalQuantity: 20,
      unit: 'plates (4 pcs)',
      dietType: 'veg',
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
      canteen: 'Engineering Food Court',
      pickupLocation: 'South Indian Counter 1',
      postedAt: getPastTime(90),
      availableFrom: getPastTime(90),
      expiryTime: getFutureTime(40), // 40 mins
      allergenInfo: 'Contains coconut. Gluten-free.',
      status: 'ALMOST_CLAIMED',
      createdBy: 'usr-admin-1'
    },
    {
      id: 'food-004',
      name: 'Vegetable Pulao & Dal Tadka',
      description: 'Mildly spiced aromatic rice with green peas, carrots, and sweet corn alongside slow-simmered yellow lentils tempered with cumin and ghee.',
      category: 'Main Course',
      quantity: 12,
      originalQuantity: 15,
      unit: 'portions',
      dietType: 'veg',
      image: 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?auto=format&fit=crop&w=800&q=80',
      canteen: 'Hostel 3 Mess',
      pickupLocation: 'Hostel 3 Dining Hall Entrance',
      postedAt: getPastTime(20),
      availableFrom: getPastTime(20),
      expiryTime: getFutureTime(150),
      allergenInfo: 'Contains ghee (dairy).',
      status: 'AVAILABLE',
      createdBy: 'usr-admin-1'
    },
    {
      id: 'food-005',
      name: 'Sambar Rice & Potato Roast',
      description: 'Traditional comforting sambar sadam prepared with drumsticks, shallots, and ghee, accompanied by mildly spiced roasted potatoes.',
      category: 'Main Course',
      quantity: 10,
      originalQuantity: 18,
      unit: 'portions',
      dietType: 'veg',
      image: 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?auto=format&fit=crop&w=800&q=80',
      canteen: 'Main Campus Canteen',
      pickupLocation: 'Main Canteen Counter 2',
      postedAt: getPastTime(60),
      availableFrom: getPastTime(60),
      expiryTime: getFutureTime(90),
      allergenInfo: 'Vegetarian. Dairy present in ghee.',
      status: 'AVAILABLE',
      createdBy: 'usr-admin-1'
    },
    {
      id: 'food-006',
      name: 'Chapati & Mixed Vegetable Curry',
      description: 'Soft whole wheat flatbreads (chapatis) with a rich, wholesome tomato and onion gravy filled with paneer cubes and garden vegetables.',
      category: 'Main Course',
      quantity: 16,
      originalQuantity: 24,
      unit: 'sets (3 chapatis + curry)',
      dietType: 'veg',
      image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
      canteen: 'Management Block Bistro',
      pickupLocation: 'Management Block Level 1 Kitchen',
      postedAt: getPastTime(15),
      availableFrom: getPastTime(15),
      expiryTime: getFutureTime(210),
      allergenInfo: 'Contains gluten (wheat) and dairy (paneer).',
      status: 'AVAILABLE',
      createdBy: 'usr-admin-1'
    },
    {
      id: 'food-007',
      name: 'Veg Hakka Fried Rice & Manchurian',
      description: 'Wok-tossed Indo-Chinese rice with crunchy spring onions, bell peppers, soy sauce, and crispy vegetable Manchurian balls in tangy sauce.',
      category: 'Main Course',
      quantity: 0,
      originalQuantity: 20,
      unit: 'portions',
      dietType: 'veg',
      image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80',
      canteen: 'Student Activity Center (SAC)',
      pickupLocation: 'SAC Food Plaza Stall 4',
      postedAt: getPastTime(180),
      availableFrom: getPastTime(180),
      expiryTime: getPastTime(30),
      allergenInfo: 'Contains soy, gluten.',
      status: 'FULLY_CLAIMED',
      createdBy: 'usr-admin-1'
    },
    {
      id: 'food-008',
      name: 'Fresh Seasonal Fruit Bowl',
      description: 'Chilled platter of freshly diced watermelon, pineapple, papaya, crisp apples, and pomegranate pearls sprinkled with chaat masala.',
      category: 'Dessert / Fruit',
      quantity: 8,
      originalQuantity: 15,
      unit: 'bowls',
      dietType: 'veg',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      canteen: 'Health Bar & Gym Cafe',
      pickupLocation: 'Sports Complex Lobby Cafe Counter',
      postedAt: getPastTime(40),
      availableFrom: getPastTime(40),
      expiryTime: getFutureTime(110),
      allergenInfo: 'All-natural fruit. 100% Vegan & Gluten-Free.',
      status: 'AVAILABLE',
      createdBy: 'usr-admin-1'
    },
    {
      id: 'food-009',
      name: 'Egg Curry & Jeera Rice',
      description: 'Boiled eggs simmered in a spiced onion-tomato masala gravy, paired with cumin-infused aromatic basmati rice.',
      category: 'Main Course',
      quantity: 9,
      originalQuantity: 12,
      unit: 'portions',
      dietType: 'non-veg',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
      canteen: 'Hostel 1 Dining Court',
      pickupLocation: 'Hostel 1 Mess Counter B',
      postedAt: getPastTime(25),
      availableFrom: getPastTime(25),
      expiryTime: getFutureTime(130),
      allergenInfo: 'Contains eggs.',
      status: 'AVAILABLE',
      createdBy: 'usr-admin-1'
    }
  ];

  const claims = [
    {
      id: 'clm-001',
      claimId: 'NW-2026-1001',
      userId: 'usr-student-1',
      foodId: 'food-001',
      quantity: 2,
      claimedAt: getPastTime(35),
      pickupTime: getFutureTime(180),
      status: 'CONFIRMED',
      userName: 'Rahul Sharma',
      foodName: 'Vegetable Biryani',
      canteenName: 'Main Campus Canteen',
      pickupLocation: 'Main Canteen Counter 3, Block A'
    },
    {
      id: 'clm-002',
      claimId: 'NW-2026-1002',
      userId: 'usr-student-2',
      foodId: 'food-003',
      quantity: 4,
      claimedAt: getPastTime(80),
      pickupTime: getPastTime(20),
      status: 'COLLECTED',
      userName: 'Priya Patel',
      foodName: 'Steamed Idli with Sambar & Chutney',
      canteenName: 'Engineering Food Court',
      pickupLocation: 'South Indian Counter 1'
    },
    {
      id: 'clm-003',
      claimId: 'NW-2026-1003',
      userId: 'usr-ngo-1',
      foodId: 'food-007',
      quantity: 20,
      claimedAt: getPastTime(160),
      pickupTime: getPastTime(40),
      status: 'COLLECTED',
      userName: 'Campus Hope Foundation (NGO)',
      foodName: 'Veg Hakka Fried Rice & Manchurian',
      canteenName: 'Student Activity Center (SAC)',
      pickupLocation: 'SAC Food Plaza Stall 4'
    }
  ];

  return { users, foods, claims };
};

// Load database from file or seed
const initDB = () => {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      database = JSON.parse(raw);
      // Ensure all arrays exist
      database.users = database.users || [];
      database.foods = database.foods || [];
      database.claims = database.claims || [];
    } else {
      database = getSeedData();
      saveDB();
    }
  } catch (err) {
    console.error('Error loading database, resetting to seed data:', err);
    database = getSeedData();
    saveDB();
  }
};

// Save database to file atomically
const saveDB = () => {
  try {
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(database, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error('Error saving database:', err);
  }
};

// Initialize on load
initDB();

module.exports = {
  getDB: () => database,
  saveDB,
  resetToSeed: () => {
    database = getSeedData();
    saveDB();
    return database;
  }
};
