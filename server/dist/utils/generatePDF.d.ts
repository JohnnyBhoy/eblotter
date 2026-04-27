import type { Response } from 'express';
import type { IBlotterDocument } from '../models/Blotter.js';
export declare function generateBlotterPDF(blotter: IBlotterDocument, res: Response): void;
export declare function generateSummaryPDF(blotters: IBlotterDocument[], scope: string, dateRange: string | null, res: Response): void;
