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


    async initialize(): Promise<void> {
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

    async resetDatabase(): Promise<void> {
        const conn = this.pool.getConnection();

        // Drop all tables
        const queries = [
            `DROP TABLE IF EXISTS UserPermissions`,
            `DROP TABLE IF EXISTS RolePermissions`,
            `DROP TABLE IF EXISTS UserRoles`,
            `DROP TABLE IF EXISTS Permissions`,
            `DROP TABLE IF EXISTS Roles`,
            `DROP TABLE IF EXISTS Users`
        ];
       
        return conn.then(async (connection) => {
            try {
                for (const query of queries) {
                    await connection.query(query);
                }

                await this.initialize();
            } finally {
                connection.release();
            }
        });
    }

    createRole(name: string, description?: string): Promise<void> {
        const conn = this.pool.getConnection();
        return conn.then(async (connection) => {
            try {
                const query = `INSERT INTO Roles (name, description) VALUES (?, ?)`;
                await connection.query(query, [name, description || null]);
            } finally {
                connection.release();
            }
        });
    }
    
    deleteRole(roleId: string | number): Promise<void> {
        const conn = this.pool.getConnection();
        return conn.then(async (connection) => {
            try {
                const query = `DELETE FROM Roles WHERE id = ?`;
                await connection.query(query, [roleId]);
            } finally {
                connection.release();
            }   
        });
    }

    createPermission(name: string, description?: string): Promise<void> {
        const conn = this.pool.getConnection();
        return conn.then(async (connection) => {
            try {
                const query = `INSERT INTO Permissions (name, description) VALUES (?, ?)`;
                await connection.query(query, [name, description || null]);
            } finally {
                connection.release();
            }
        });
    }

    deletePermission(permissionId: string | number): Promise<void> {
        const conn = this.pool.getConnection();
        return conn.then(async (connection) => {
            try {
                const query = `DELETE FROM Permissions WHERE id = ?`;
                await connection.query(query, [permissionId]);
            } finally {
                connection.release();
            }   
        }); 
    }

    async createUser(email: string): Promise<void> {
        const conn = await this.pool.getConnection();
        try {
            const query = `INSERT INTO Users (email) VALUES (?)`;
            await conn.query(query, [email]);
        } catch (error: any) {
            // MySQL error code 1062 = duplicate entry
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('USER_ALREADY_EXISTS');
            }
            throw error; // Re-throw other errors
        } finally {
            conn.release();
        }
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



    async deleteUser(userId: string | number): Promise<void> {
        throw new Error("Method not implemented.");
    }

}