import type { Request, Response, NextFunction } from 'express';
export declare const login: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const logout: (_req: Request, res: Response) => void;
export declare const changePassword: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getMe: (req: Request, res: Response) => void;
