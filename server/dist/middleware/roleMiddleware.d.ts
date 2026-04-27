import type { Request, Response, NextFunction } from 'express';
export declare const authorize: (...roles: string[]) => (req: Request, res: Response, next: NextFunction) => void;
