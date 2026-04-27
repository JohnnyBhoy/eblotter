import type { Response } from 'express';
import type { IBlotterDocument } from '../models/Blotter.js';
export declare function generateBlotterDocx(blotter: IBlotterDocument, res: Response): Promise<void>;
