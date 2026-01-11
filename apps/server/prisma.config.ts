import path from 'node:path';
import { defineConfig } from 'prisma/config';

export default defineConfig({
    schema: path.join(import.meta.dirname, 'prisma', 'schema.prisma'),

    migrate: {
        async adapter() {
            const { PrismaNeon } = await import('@prisma/adapter-neon');
            const connectionString = process.env.DATABASE_URL!;
            return new PrismaNeon({ connectionString });
        },
    },
});
