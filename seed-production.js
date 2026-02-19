
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
            isFeatured: true,
            totalSqft: 15000,
            pricePerSqft: 5666,
            sqftSold: 9750,
            description: 'Grade A Building situated in the heart of Electronic City Phase 1. Premium commercial office space with modern amenities and high-quality construction. Leased to a Fortune 500 technology firm with a long-term commitment.',
            highlights: [
                'Grade A Building situated in the heart of Electronic City.',
                '100% Leased to Fortune 500 tech company.',
                '9-year lock-in period ensuring stable rental income.',
                'Professional property management by JLL.'
            ],
            tenantName: 'TechGlobal Solutions Pvt Ltd.',
            tenantDescription: 'Leading IT consultancy firm with 50+ offices globally.',
            financials: {
                rentalYield: '8.4%',
                grossYield: '9.5%',
                fees: '-1.1%',
                appreciation: '+12.5% in last 2 years',
                tenantOccupancy: '100%'
            },
            documents: [
                { name: 'Property Valuation Report', type: 'PDF', size: '2.4 MB' },
                { name: 'Legal Due Diligence', type: 'PDF', size: '4.1 MB' },
                { name: 'Tenancy Agreement', type: 'DOCX', size: '1.2 MB' },
                { name: 'SPV Structure', type: 'PDF', size: '0.8 MB' }
            ],
            priceHistory: [
                { date: 'Jan 23', value: 7500 },
                { date: 'Apr 23', value: 7800 },
                { date: 'Jul 23', value: 8200 },
                { date: 'Oct 23', value: 8550 },
                { date: 'Jan 24', value: 9000 }
            ]
        },
        // ... (Similar structure for other properties would go here, omitting for brevity in this tool call to avoid token limits but acknowledging the pattern)
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
            isFeatured: true,
            totalSqft: 50000,
            pricePerSqft: 8400,
            sqftSold: 11000,
            description: 'State-of-the-art warehousing facility strategically located near Mumbai-Nashik highway.',
            highlights: ['Strategic location.', 'Pre-leased to E-commerce giant.'],
            tenantName: 'FastKart Logistics',
            tenantDescription: 'E-commerce delivery partner.',
            financials: { rentalYield: '9.1%', appreciation: '+18%' },
            priceHistory: [{ date: 'Jan 23', value: 8000 }, { date: 'Jan 24', value: 9500 }]
        },
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
