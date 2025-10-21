import { Elysia } from 'elysia';

export const ElysiaRoute = new Elysia()
        .get('/status', () => 'GateKeeper is running!')
        .get("/", () => "Welcome to GateKeeper Route!");