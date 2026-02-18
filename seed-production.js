
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
    // Create a test user with a known ID for easy testing
    const testUser = await prisma.user.upsert({
        where: { email: 'test@realblock.com' },
        update: {},
        create: {
            id: 'test-user-12345', // Fixed ID for easy testing
            email: 'test@realblock.com',
            isKycVerified: false,
        },
    });

    console.log('✅ Test user created:');
    console.log('   ID:', testUser.id);
    console.log('   Email:', testUser.email);
    console.log('');
    console.log('🔑 Use this Authorization header for testing:');
    console.log('   Authorization: Bearer', testUser.id);

    // Initial properties data
    const properties = [
        {
            name: 'Horizon Tech Park',
            location: 'Bengaluru, India',
            type: 'COMMERCIAL',
            assetValue: '₹85 Cr',
            irr: '11.8%',
            yield: '8.5%',
            progress: 65,
            minInvestment: '₹5,000',
            image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80',
            status: 'OPEN',
            isFeatured: true
        },
        {
            name: 'North Logistics Hub',
            location: 'Bhiwandi, Mumbai',
            type: 'WAREHOUSING',
            assetValue: '₹42 Cr',
            irr: '13.2%',
            yield: '9.1%',
            progress: 22,
            minInvestment: '₹10,000',
            image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80',
            status: 'OPEN',
            isFeatured: true
        },
        {
            name: 'Azure Heights Phase 2',
            location: 'Hyderabad, India',
            type: 'RESIDENTIAL',
            assetValue: '₹120 Cr',
            irr: '14.5%',
            yield: '7.8%',
            progress: 100,
            minInvestment: '₹25,000',
            image: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1000&q=80',
            status: 'FULLY_FUNDED',
            isFeatured: true
        },
        {
            name: 'Skyline Office Complex',
            location: 'Pune, India',
            type: 'COMMERCIAL',
            assetValue: '₹65 Cr',
            irr: '12.1%',
            yield: '8.8%',
            progress: 45,
            minInvestment: '₹7,500',
            image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80',
            status: 'OPEN',
            isFeatured: false
        },
        {
            name: 'Greenfield Warehousing',
            location: 'Chennai, India',
            type: 'WAREHOUSING',
            assetValue: '₹38 Cr',
            irr: '13.5%',
            yield: '9.3%',
            progress: 15,
            minInvestment: '₹10,000',
            image: 'https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&w=1000&q=80',
            status: 'OPEN',
            isFeatured: false
        },
        {
            name: 'Lakeview Residency',
            location: 'Thane, Mumbai',
            type: 'RESIDENTIAL',
            assetValue: '₹95 Cr',
            irr: '14.2%',
            yield: '7.5%',
            progress: 88,
            minInvestment: '₹20,000',
            image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80',
            status: 'OPEN',
            isFeatured: false
        },
        {
            name: 'Tech Hub II',
            location: 'Hyderabad, India',
            type: 'COMMERCIAL',
            assetValue: '₹110 Cr',
            irr: '11.5%',
            yield: '8.2%',
            progress: 100,
            minInvestment: '₹15,000',
            image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1000&q=80',
            status: 'FULLY_FUNDED',
            isFeatured: false
        },
        {
            name: 'Westside Logistics Park',
            location: 'Ahmedabad, Gujarat',
            type: 'WAREHOUSING',
            assetValue: '₹55 Cr',
            irr: '12.8%',
            yield: '9.0%',
            progress: 58,
            minInvestment: '₹12,000',
            image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1000&q=80',
            status: 'OPEN',
            isFeatured: false
        },
        {
            name: 'Metro City Plaza',
            location: 'New Delhi, India',
            type: 'COMMERCIAL',
            assetValue: '₹150 Cr',
            irr: '10.9%',
            yield: '7.9%',
            progress: 100,
            minInvestment: '₹50,000',
            image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1000&q=80',
            status: 'FULLY_FUNDED',
            isFeatured: false
        }
    ];

    // Clear existing properties to avoid duplicates in this simple seed script
    await prisma.property.deleteMany({});

    // Seed new properties
    await prisma.property.createMany({
        data: properties
    });

    console.log('✅ Properties seeded successfully!');
}

seed()
    .catch((error) => {
        console.error('❌ Seed failed:', error);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
