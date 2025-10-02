import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    schema: './src/exercise3/schema.ts',
    dialect: 'sqlite',
    dbCredentials: {
        url: 'data/exercise3.db',
    },
});
