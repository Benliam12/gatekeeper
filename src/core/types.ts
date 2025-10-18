
export interface Database{
    query<T=any>(sql: string, params?: any[]): Promise<T>;
}

export interface DatabaseAdapter{
    createTable(): Promise<void>;
    resetDatabase(): Promise<void>;
    resetTable(tableName: string): Promise<void>;

    createRole(name: string, description?: string): Promise<void>;
    deleteRole(roleId: string | number): Promise<void>;

    createPermission(name: string, description?: string): Promise<void>;
    deletePermission(permissionId: string | number): Promise<void>;

    assignRoleToUser(userId: string | number, roleId: string | number): Promise<void>;
    removeRoleFromUser(userId: string | number, roleId: string | number): Promise<void>;

    assignPermissionToRole(roleId: string | number, permissionId: string | number): Promise<void>;
    removePermissionFromRole(roleId: string | number, permissionId: string | number): Promise<void>;

    assignPermissionToUser(userId: string | number, permissionId: string | number): Promise<void>;
    removePermissionFromUser(userId: string | number, permissionId: string | number): Promise<void>;

    checkUserPermission(userId: string | number, permissionName: string): Promise<boolean>;
}

export interface PermissionConfig{
    database: Database;
    databaseAdapter: DatabaseAdapter;
    useCache: boolean;
    jwtSecret?: string;
    tablePrefix?: string;
}

export interface Permission{
    id: string | number;
    name: string;
    description?: string;
}

export interface Role{
    id: string | number;
    name: string;
    permissions: Permission[];
}

export interface User{
    id: string | number;
    email?: string;
    roles: Role[];
    permissions: Permission[];
}