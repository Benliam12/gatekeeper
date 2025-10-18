console.log("Hello via Bun!");import { Elysia } from 'elysia';

// Test importing your main package
import { test, MariaDBAdapter } from '@benliam12/gatekeeper';

const adapter = new MariaDBAdapter({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'Test'
});


adapter.createTable().then(() => {
    console.log("Tables created successfully.");
});

const app = new Elysia()
  .get('/', () => 'Gatekeeper test app is running!')
  .get("/test-func", ()=>{
    const result = test(2,3);
    return { result };
  })
  .get('/test', () => {
    // Test your package functionality here
    console.log('Testing gatekeeper package...');
    
    // Example: Create a simple permission check
    // Replace with your actual API
    try {
      // const result = yourGatekeeperFunction();
      return { 
        status: 'success', 
        message: 'Gatekeeper package imported successfully!',
        // result 
      };
    } catch (error) {
      return { 
        status: 'error', 
        message: 'Error testing gatekeeper package',
        error: error instanceof Error ? error.message : String(error)
      };
    }
  })
  .listen(3000);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
console.log('Test your package at: http://localhost:3000/test');