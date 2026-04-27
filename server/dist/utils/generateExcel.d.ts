import type { Response } from 'express';
import type { IBlotterDocument } from '../models/Blotter.js';
export declare function generateBlotterExcel(blotter: IBlotterDocument, res: Response): Promise<void>;
export declare function generateSummaryExcel(blotters: IBlotterDocument[], scope: string, dateRange: string | null, res: Response, provincialMode?: boolean): Promise<void>;
