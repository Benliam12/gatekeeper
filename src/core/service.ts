import { PermissionConfig } from "./types.js";

export class PermissionService {

    constructor(private config: PermissionConfig) {}

    /**
     * Create the necessary tables in the database
     */
    async initialize(): Promise<void> {
        await this.config.databaseAdapter.connect();
        await this.config.databaseAdapter.createTable();
    }

    /**
     * Get all roles
     */
    async getAllRoles(): Promise<void>{
    }

    async hasPermission(userId: string | number, permissionName: string): Promise<boolean> {
        return await this.config.databaseAdapter.checkUserPermission(userId, permissionName);
    }

}