import Blotter from '../models/Blotter.js';
import { scopeFilter } from './blotterController.js';
import { generateBlotterPDF, generateSummaryPDF } from '../utils/generatePDF.js';
import { generateBlotterDocx } from '../utils/generateDocx.js';
import { generateBlotterExcel, generateSummaryExcel } from '../utils/generateExcel.js';
async function fetchBlotterById(id, user) {
    const filter = await scopeFilter(user);
    filter['_id'] = id;
    return Blotter.findOne(filter)
        .populate('barangay').populate('municipality').populate('province')
        .populate('createdBy', 'fullName username');
}
async function fetchScopedBlotters(user, query = {}) {
    const filter = await scopeFilter(user);
    const { dateFrom, dateTo, status, incidentType, barangayId, municipalityId } = query;
    if (status)
        filter['status'] = status;
    if (incidentType)
        filter['incident.type'] = incidentType;
    if (barangayId)
        filter['barangay'] = barangayId;
    if (municipalityId)
        filter['municipality'] = municipalityId;
    if (dateFrom || dateTo) {
        filter['dateRecorded'] = {};
        if (dateFrom)
            filter['dateRecorded'].$gte = new Date(dateFrom);
        if (dateTo)
            filter['dateRecorded'].$lte = new Date(dateTo);
    }
    return Blotter.find(filter)
        .populate('barangay', 'name').populate('municipality', 'name').populate('province', 'name')
        .sort({ dateRecorded: -1 });
}
export const exportBlotterPDF = async (req, res, next) => {
    try {
        const blotter = await fetchBlotterById(String(req.params['id']), req.user);
        if (!blotter) {
            res.status(404).json({ message: 'Blotter not found' });
            return;
        }
        generateBlotterPDF(blotter, res);
    }
    catch (err) {
        next(err);
    }
};
export const exportBlotterDocx = async (req, res, next) => {
    try {
        const blotter = await fetchBlotterById(String(req.params['id']), req.user);
        if (!blotter) {
            res.status(404).json({ message: 'Blotter not found' });
            return;
        }
        await generateBlotterDocx(blotter, res);
    }
    catch (err) {
        next(err);
    }
};
export const exportBlotterExcel = async (req, res, next) => {
    try {
        const blotter = await fetchBlotterById(String(req.params['id']), req.user);
        if (!blotter) {
            res.status(404).json({ message: 'Blotter not found' });
            return;
        }
        await generateBlotterExcel(blotter, res);
    }
    catch (err) {
        next(err);
    }
};
export const exportSummaryExcel = async (req, res, next) => {
    try {
        const blotters = await fetchScopedBlotters(req.user, req.query);
        const { dateFrom, dateTo } = req.query;
        const scopeLabel = req.user.scopeLabel || req.user.role;
        const dateRange = dateFrom && dateTo
            ? `${new Date(dateFrom).toLocaleDateString('en-PH')} – ${new Date(dateTo).toLocaleDateString('en-PH')}`
            : null;
        const provincialMode = req.user.role === 'provincial' || req.user.role === 'super_admin';
        await generateSummaryExcel(blotters, scopeLabel, dateRange, res, provincialMode);
    }
    catch (err) {
        next(err);
    }
};
export const exportSummaryPDF = async (req, res, next) => {
    try {
        const blotters = await fetchScopedBlotters(req.user, req.query);
        const { dateFrom, dateTo } = req.query;
        const scopeLabel = req.user.scopeLabel || req.user.role;
        const dateRange = dateFrom && dateTo
            ? `${new Date(dateFrom).toLocaleDateString('en-PH')} – ${new Date(dateTo).toLocaleDateString('en-PH')}`
            : null;
        generateSummaryPDF(blotters, scopeLabel, dateRange, res);
    }
    catch (err) {
        next(err);
    }
};
//# sourceMappingURL=exportController.js.map