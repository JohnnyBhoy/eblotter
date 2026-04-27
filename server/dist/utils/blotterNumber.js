import Municipality from '../models/Municipality.js';
import Blotter from '../models/Blotter.js';
export async function generateBlotterNumber(municipalityId) {
    const mun = await Municipality.findById(municipalityId);
    if (!mun)
        throw new Error('Municipality not found');
    const year = new Date().getFullYear();
    const munName = mun.name.toUpperCase().replace(/\s+/g, '-');
    const prefix = `BLT-${munName}-${year}`;
    const last = await Blotter.findOne({ blotterNumber: { $regex: `^${prefix}` } }, {}, { sort: { blotterNumber: -1 } });
    let seq = '0001';
    if (last?.blotterNumber) {
        const parts = last.blotterNumber.split('-');
        const lastSeq = parseInt(parts[parts.length - 1] ?? '0', 10);
        seq = String(lastSeq + 1).padStart(4, '0');
    }
    return `${prefix}-${seq}`;
}
//# sourceMappingURL=blotterNumber.js.map