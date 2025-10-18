export * from './core/types.js';
export * from './core/service.js';
export { MariaDBAdapter } from './database/mariadb-adapter.js';
export * from './database/mssql-adapter.js';

export function test(n:number, n2:number): number {
  return n + n2;
}