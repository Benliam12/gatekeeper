import { DatabaseAdapter, Permission } from "../core/types";

export class MSSQLAdapter {

    getUserPermissions(userId: string | number): Promise<Permission[]> {
        throw new Error("Method not implemented.");
    }
    connect(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    disconnect(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    resetDatabase(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    resetTable(tableName: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    createRole(name: string, description?: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    deleteRole(roleId: string | number): Promise<void> {
        throw new Error("Method not implemented.");
    }
    createPermission(name: string, description?: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    deletePermission(permissionId: string | number): Promise<void> {
        throw new Error("Method not implemented.");
    }
    assignRoleToUser(userId: string | number, roleId: string | number): Promise<void> {
        throw new Error("Method not implemented.");
    }
    removeRoleFromUser(userId: string | number, roleId: string | number): Promise<void> {
        throw new Error("Method not implemented.");
    }
    assignPermissionToRole(roleId: string | number, permissionId: string | number): Promise<void> {
        throw new Error("Method not implemented.");
    }
    removePermissionFromRole(roleId: string | number, permissionId: string | number): Promise<void> {
        throw new Error("Method not implemented.");
    }
    assignPermissionToUser(userId: string | number, permissionId: string | number): Promise<void> {
        throw new Error("Method not implemented.");
    }
    removePermissionFromUser(userId: string | number, permissionId: string | number): Promise<void> {
        throw new Error("Method not implemented.");
    }
    checkUserPermission(userId: string | number, permissionName: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    async createTable(): Promise<void> {
        
        // Implementation for creating a table in MSSQL
    }

    async dropTable(): Promise<void> {
        // Implementation for dropping a table in MSSQL
    }
}