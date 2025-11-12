import { PermissionConfig } from "./types.js";

export class PermissionService {

    constructor(private config: PermissionConfig) {}

    /**
     * Create the necessary tables in the database
     */
    async initialize(): Promise<void> {
        await this.config.databaseAdapter.connect();
        await this.config.databaseAdapter.initialize();
    }

    /**
     * Returns if the user has the specified permission
     * @param userId 
     * @param permissionName 
     * @returns 
     */
    hasPermission(userId: string | number, permissionName: string): Promise<boolean> {
        return this.config.databaseAdapter.getUserPermissions(userId).then(permissions => {
            return permissions.some(p => p.name === permissionName);
        });
    }

    assignPermissionToUser(userId: string | number, permissionName: string): Promise<void> {
        return this.config.databaseAdapter.assignPermissionToUser(userId, permissionName);
    }

    assignPermissionToRole(roleId: string | number, permissionName: string): Promise<void> {
        return this.config.databaseAdapter.assignPermissionToRole(roleId, permissionName);
    }

    assignRoleToUser(userId: string | number, roleId: string | number): Promise<void> {
        return this.config.databaseAdapter.assignRoleToUser(userId, roleId);
    }
}