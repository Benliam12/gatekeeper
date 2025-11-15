import { Elysia } from 'elysia';

// Test importing your main package
import { MariaDBAdapter } from '@benliam12/gatekeeper';

const adapter = new MariaDBAdapter({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'Test'
});


adapter.initialize().then(() => {
    console.log("Tables created successfully.");
});

const app = new Elysia()
    .get('/', () => 'Gatekeeper test app is running!')
    .get("/resetTable", async () => {   
        try {
            await adapter.resetDatabase();
            return { status: "success", message: "Database reset successfully." };
        } catch (error) {
            return { status: "error", message: "Failed to reset database." };
        }
    })

    .post("/user/create", async ({ body }) => {
        const { email } = body as { email: string };
        try {
            await adapter.createUser(email);
            return { status: "success", message: "User created successfully." };
        } catch (error: any) {
            if (error.message === 'USER_ALREADY_EXISTS') {
                return { status: "error", message: "User already exists." };
            }
            throw error; // Re-throw unexpected errors
        }
    })
  .listen(3000);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);