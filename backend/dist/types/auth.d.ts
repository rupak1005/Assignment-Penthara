import type { Request } from "express";
export interface JwtUserPayload {
    id: string;
    email: string;
    name: string;
}
export interface AuthenticatedRequest extends Request {
    user?: JwtUserPayload;
}
//# sourceMappingURL=auth.d.ts.map