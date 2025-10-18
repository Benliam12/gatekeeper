import { PermissionConfig } from "./types.js";

export class PermissionService {

    constructor(private config: PermissionConfig) {}

    /**
     * Get all roles
     */
    async getAllRoles(): Promise<void>{
    }

    async hasPermission(userId: string | number, permissionName: string): Promise<boolean> {
        return await this.config.databaseAdapter.checkUserPermission(userId, permissionName);
    }

}