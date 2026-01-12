import path from 'node:path';
import { defineConfig } from 'prisma/config';
import { config } from 'dotenv';

config();

export default defineConfig({
    schema: path.join(import.meta.dirname, 'prisma', 'schema.prisma'),

    datasource: {
        url: process.env.DATABASE_URL!,
    },

    migrate: {
        async adapter() {
            const { PrismaNeon } = await import('@prisma/adapter-neon');
            const connectionString = process.env.DATABASE_URL!;
            return new PrismaNeon({ connectionString });
        },
    },
});
