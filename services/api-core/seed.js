// Database Seeder Script for ShiftMate
// This script populates the database with dummy data for testing

const { PrismaClient } = require('./generated/prisma');
const prisma = new PrismaClient();

const dummyUsers = [
  {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1-555-0101',
    password: 'password123', // In production, this should be hashed
  },
  {
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+1-555-0102',
    password: 'password123',
  },
  {
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    phone: '+1-555-0103',
    password: 'password123',
  },
  {
    name: 'Alice Williams',
    email: 'alice.williams@example.com',
    phone: '+1-555-0104',
    password: 'password123',
  },
  {
    name: 'Charlie Brown',
    email: 'charlie.brown@example.com',
    phone: '+1-555-0105',
    password: 'password123',
  },
];

const dummyBookings = [
  {
    pickupAddress: '123 Main St, New York, NY 10001',
    dropoffAddress: '456 Oak Ave, Brooklyn, NY 11201',
    distance: 5.2,
    scheduledDate: new Date('2025-11-15T09:00:00'),
    status: 'confirmed',
    totalPrice: 450.00,
  },
  {
    pickupAddress: '789 Business Blvd, Manhattan, NY 10013',
    dropoffAddress: '321 Commerce St, Queens, NY 11101',
    distance: 8.5,
    scheduledDate: new Date('2025-11-20T14:00:00'),
    status: 'pending',
    totalPrice: 320.00,
  },
  {
    pickupAddress: '555 Elm Street, Bronx, NY 10451',
    dropoffAddress: '888 Pine Road, Staten Island, NY 10301',
    distance: 15.3,
    scheduledDate: new Date('2025-11-10T08:00:00'),
    status: 'in_progress',
    totalPrice: 890.00,
  },
  {
    pickupAddress: '222 Storage Lane, Brooklyn, NY 11215',
    dropoffAddress: '111 Home Dr, Manhattan, NY 10002',
    distance: 3.7,
    scheduledDate: new Date('2025-10-25T10:00:00'),
    status: 'completed',
    totalPrice: 280.00,
  },
  {
    pickupAddress: '999 Cancel Ave, Queens, NY 11106',
    dropoffAddress: '777 Future St, Bronx, NY 10469',
    distance: 12.1,
    scheduledDate: new Date('2025-12-01T11:00:00'),
    status: 'cancelled',
    totalPrice: 550.00,
  },
];

async function seedDatabase() {
  console.log('🌱 Starting database seeding...\n');

  try {
    // Clear existing data
    console.log('📝 Clearing existing data...');
    await prisma.item.deleteMany({});
    await prisma.booking.deleteMany({});
    await prisma.user.deleteMany({});
    console.log('✅ Existing data cleared\n');

    // Create users
    console.log('👥 Creating users...');
    const createdUsers = [];
    for (const userData of dummyUsers) {
      const user = await prisma.user.create({
        data: userData,
      });
      createdUsers.push(user);
      console.log(`   ✓ Created user: ${user.name} (ID: ${user.id})`);
    }
    console.log(`✅ Created ${createdUsers.length} users\n`);

    // Create bookings
    console.log('📋 Creating bookings...');
    const createdBookings = [];
    for (let i = 0; i < dummyBookings.length; i++) {
      const bookingData = dummyBookings[i];
      const booking = await prisma.booking.create({
        data: {
          ...bookingData,
          userId: createdUsers[i % createdUsers.length].id, // Distribute bookings among users
        },
      });
      createdBookings.push(booking);
      console.log(`   ✓ Created booking: ${booking.id.substring(0, 8)}... (Status: ${booking.status})`);
    }
    console.log(`✅ Created ${createdBookings.length} bookings\n`);

    // Create sample items for some bookings
    console.log('📦 Creating sample items...');
    const sampleItems = [
      { name: 'Sofa', category: 'furniture', quantity: 1, volume: 2.5, confidence: 0.95, bookingId: createdBookings[0].id },
      { name: 'Dining Table', category: 'furniture', quantity: 1, volume: 1.8, confidence: 0.92, bookingId: createdBookings[0].id },
      { name: 'Chair', category: 'furniture', quantity: 6, volume: 0.5, confidence: 0.88, bookingId: createdBookings[0].id },
      { name: 'Bed', category: 'furniture', quantity: 2, volume: 3.0, confidence: 0.94, bookingId: createdBookings[2].id },
      { name: 'Wardrobe', category: 'furniture', quantity: 2, volume: 4.5, confidence: 0.91, bookingId: createdBookings[2].id },
      { name: 'Desk', category: 'furniture', quantity: 1, volume: 1.2, confidence: 0.89, bookingId: createdBookings[1].id },
      { name: 'Bookshelf', category: 'furniture', quantity: 2, volume: 1.5, confidence: 0.90, bookingId: createdBookings[1].id },
    ];

    for (const itemData of sampleItems) {
      const item = await prisma.item.create({
        data: itemData,
      });
      console.log(`   ✓ Created item: ${item.name} x${item.quantity}`);
    }
    console.log(`✅ Created ${sampleItems.length} items\n`);

    // Display summary
    console.log('📊 Database Seeding Summary:');
    console.log('================================');
    console.log(`   Users:    ${createdUsers.length}`);
    console.log(`   Bookings: ${createdBookings.length}`);
    console.log(`   Items:    ${sampleItems.length}`);
    console.log('================================\n');

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📝 Test Credentials (all users):');
    console.log('   Password: password123');
    console.log('\n📧 Sample Users:');
    createdUsers.forEach(user => {
      console.log(`   - ${user.email}`);
    });
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeder
seedDatabase()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
