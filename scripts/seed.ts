const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    await prisma.Category.createMany({
        data: [
            { name: 'React' },
            { name: 'Angular' },
            { name: 'Vue' },
            { name: 'Svelte' },
            { name: 'Next.js' },
            { name: 'Nuxt.js' },
            { name: 'Gatsby' },
            { name: 'Ember.js' },
            { name: 'Backbone.js' },
            { name: 'Meteor' },
            // Add more categories as needed
        ],
    });
    console.log('Seeding complete');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
