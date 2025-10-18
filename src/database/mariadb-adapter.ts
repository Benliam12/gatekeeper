import mariadb from "mariadb"
import { DatabaseAdapter, Permission } from "../core/types";


export class MariaDBAdapter implements DatabaseAdapter {

    private pool: mariadb.Pool;

    constructor(config: mariadb.PoolConfig) {
        this.pool = mariadb.createPool(config);
    }

    async getUserPermissions(userId: string | number): Promise<Permission[]> {
        const conn = await this.pool.getConnection();
        const query = `
            SELECT DISTINCT p.id, p.name, p.description
            FROM Permissions P

            WHERE P.id IN (
                SELECT up.permission_id
                FROM UserPermissions up
                WHERE up.user_id = ?

                UNION

                SELECT rp.permission_id
                FROM RolePermissions rp
                JOIN UserRoles ur ON rp.role_id = ur.role_id
                WHERE ur.user_id = ?
            )
        `;

        try{
            const results = await conn.query<Permission[]>(query, [userId, userId]);
            return results;
        } catch (err){
            //Return empty array on error
            return []
        } finally
        {
            conn.release();
        }
    }


    async connect(): Promise<void> {
    }

    async disconnect(): Promise<void> {
        await this.pool.end();
    }


    async createTable(): Promise<void> {
        const queries = [
            `CREATE TABLE IF NOT EXISTS Users (
                id INT PRIMARY KEY AUTO_INCREMENT,
                email VARCHAR(255) UNIQUE NOT NULL
            )`,
            
            `CREATE TABLE IF NOT EXISTS Roles (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(255) UNIQUE NOT NULL,
                description TEXT
            )`,

            `CREATE TABLE IF NOT EXISTS Permissions (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(255) UNIQUE NOT NULL,
                description TEXT
            )`,

            `CREATE TABLE IF NOT EXISTS UserRoles (
                user_id INT,
                role_id INT,
                PRIMARY KEY (user_id, role_id),
                FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
                FOREIGN KEY (role_id) REFERENCES Roles(id) ON DELETE CASCADE
            )`,
            
            `CREATE TABLE IF NOT EXISTS RolePermissions (
                role_id INT,
                permission_id INT,
                PRIMARY KEY (role_id, permission_id),
                FOREIGN KEY (role_id) REFERENCES Roles(id) ON DELETE CASCADE,
                FOREIGN KEY (permission_id) REFERENCES Permissions(id) ON DELETE CASCADE
            )`,

            `CREATE TABLE IF NOT EXISTS UserPermissions (
                user_id INT,
                permission_id INT,
                PRIMARY KEY (user_id, permission_id),
                FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
                FOREIGN KEY (permission_id) REFERENCES Permissions(id) ON DELETE CASCADE
            )`
        ];

        const conn = await this.pool.getConnection();

        try {
            for (const query of queries) {
                await conn.query(query);
            }
        } finally {
            conn.release();
        }
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

}