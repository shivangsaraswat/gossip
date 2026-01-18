import prisma from './src/lib/prisma.js';

async function cleanupOldFollowRequests() {
    console.log('🔍 Checking for existing follow requests...\n');

    // List all follow requests
    const requests = await prisma.followRequest.findMany({
        include: {
            sender: {
                select: {
                    username: true,
                    displayName: true,
                },
            },
            receiver: {
                select: {
                    username: true,
                    displayName: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    if (requests.length === 0) {
        console.log('✅ No follow requests found in database.\n');
        return;
    }

    console.log(`Found ${requests.length} follow request(s):\n`);

    requests.forEach((req, index) => {
        console.log(`${index + 1}. ${req.sender.displayName} (@${req.sender.username}) → ${req.receiver.displayName} (@${req.receiver.username})`);
        console.log(`   ID: ${req.id}`);
        console.log(`   Created: ${req.createdAt}\n`);
    });

    // Delete all old requests (they don't have notifications)
    console.log('🗑️  Deleting old follow requests (created before notification system)...\n');

    const deleteResult = await prisma.followRequest.deleteMany({});

    console.log(`✅ Deleted ${deleteResult.count} follow request(s).\n`);
    console.log('💡 Now when Ajay sends a new request, it will create a notification properly!\n');
}

cleanupOldFollowRequests()
    .then(() => {
        console.log('✨ Cleanup complete!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Error:', error);
        process.exit(1);
    });
