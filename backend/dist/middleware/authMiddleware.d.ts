import type { Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "../types/auth";
export declare const authenticate: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export default authenticate;
//# sourceMappingURL=authMiddleware.d.ts.map