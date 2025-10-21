export interface DatabaseAdapter{
    connect(): Promise<void>;
    disconnect(): Promise<void>;

    initialize(): Promise<void>;
    resetDatabase(): Promise<void>;

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

    getUserPermissions(userId: string | number): Promise<Permission[]>;
}

export interface PermissionConfig{
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