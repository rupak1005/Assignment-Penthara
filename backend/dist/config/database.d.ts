import { Pool, type QueryResultRow } from "pg";
export declare const pool: Pool;
export declare const query: <T extends QueryResultRow = QueryResultRow>(text: string, params?: any[]) => Promise<import("pg").QueryResult<T>>;
export declare const initDb: () => Promise<void>;
export default pool;
//# sourceMappingURL=database.d.ts.map