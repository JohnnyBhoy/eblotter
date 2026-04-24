import Blotter from '../models/Blotter.js';
import Barangay from '../models/Barangay.js';
import Municipality from '../models/Municipality.js';
import AuditLog from '../models/AuditLog.js';
import { generateBlotterNumber } from '../utils/blotterNumber.js';

export const scopeFilter = async (user) => {
  switch (user.role) {
    case 'barangay':
      return { barangay: user.barangay?._id || user.barangay, isDeleted: false };

    case 'municipal': {
      const barangays = await Barangay.find(
        { municipality: user.municipality?._id || user.municipality }, '_id'
      );
      return { barangay: { $in: barangays.map(b => b._id) }, isDeleted: false };
    }

    case 'provincial': {
      const municipalities = await Municipality.find(
        { province: user.province?._id || user.province }, '_id'
      );
      const barangays = await Barangay.find(
        { municipality: { $in: municipalities.map(m => m._id) } }, '_id'
      );
      return { barangay: { $in: barangays.map(b => b._id) }, isDeleted: false };
    }

    case 'super_admin':
      return { isDeleted: false };

    default:
      return { isDeleted: false };
  }
};

export const createBlotter = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user.barangay) return res.status(400).json({ message: 'User has no assigned barangay' });

    const barangayId = user.barangay._id || user.barangay;
    const barangay = await Barangay.findById(barangayId).populate('municipality').populate('province');
    if (!barangay) return res.status(400).json({ message: 'Barangay not found' });

    const munId = barangay.municipality._id || barangay.municipality;
    const provId = barangay.province._id || barangay.province;
    const blotterNumber = await generateBlotterNumber(munId);

    const blotter = await Blotter.create({
      ...req.body,
      blotterNumber,
      barangay: barangayId,
      municipality: munId,
      province: provId,
      createdBy: user._id,
      recordedBy: {
        name: req.body.recordedBy?.name || user.fullName,
        position: req.body.recordedBy?.position || 'Barangay Official',
      }
    });

    await AuditLog.create({
      action: 'CREATE_BLOTTER',
      performedBy: user._id,
      targetBlotter: blotter._id,
      details: `Created blotter ${blotterNumber}`,
      ipAddress: req.ip
    });

    const populated = await Blotter.findById(blotter._id)
      .populate('barangay')
      .populate('municipality')
      .populate('province')
      .populate('createdBy', 'fullName username');

    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
};

export const getBlotters = async (req, res, next) => {
  try {
    const filter = await scopeFilter(req.user);
    const { page = 1, limit = 20, status, incidentType, search, barangayId, municipalityId, dateFrom, dateTo } = req.query;

    if (status) filter.status = status;
    if (incidentType) filter['incident.type'] = incidentType;
    if (barangayId) filter.barangay = barangayId;
    if (municipalityId) filter.municipality = municipalityId;
    if (dateFrom || dateTo) {
      filter.dateRecorded = {};
      if (dateFrom) filter.dateRecorded.$gte = new Date(dateFrom);
      if (dateTo) filter.dateRecorded.$lte = new Date(dateTo);
    }
    if (search) {
      filter.$or = [
        { blotterNumber: { $regex: search, $options: 'i' } },
        { 'complainant.firstName': { $regex: search, $options: 'i' } },
        { 'complainant.lastName': { $regex: search, $options: 'i' } },
        { 'incident.narrative': { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Blotter.countDocuments(filter);
    const blotters = await Blotter.find(filter)
      .populate('barangay', 'name')
      .populate('municipality', 'name')
      .populate('province', 'name')
      .populate('createdBy', 'fullName username')
      .sort({ dateRecorded: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    res.json({ blotters, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    next(err);
  }
};

export const getBlotter = async (req, res, next) => {
  try {
    const filter = await scopeFilter(req.user);
    filter._id = req.params.id;
    const blotter = await Blotter.findOne(filter)
      .populate('barangay')
      .populate('municipality')
      .populate('province')
      .populate('createdBy', 'fullName username');
    if (!blotter) return res.status(404).json({ message: 'Blotter not found' });
    res.json(blotter);
  } catch (err) {
    next(err);
  }
};

export const updateBlotter = async (req, res, next) => {
  try {
    const user = req.user;
    const blotter = await Blotter.findOne({ _id: req.params.id, isDeleted: false, createdBy: user._id });
    if (!blotter) return res.status(404).json({ message: 'Blotter not found or access denied' });

    Object.assign(blotter, req.body);
    blotter.lastUpdated = new Date();
    blotter.updatedBy = user._id;
    await blotter.save();

    await AuditLog.create({
      action: 'UPDATE_BLOTTER',
      performedBy: user._id,
      targetBlotter: blotter._id,
      details: `Updated blotter ${blotter.blotterNumber}`,
      ipAddress: req.ip
    });

    const updated = await Blotter.findById(blotter._id)
      .populate('barangay').populate('municipality').populate('province');
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['draft', 'recorded', 'under_mediation', 'settled', 'referred_to_pnp', 'closed'];
    if (!validStatuses.includes(status))
      return res.status(400).json({ message: 'Invalid status' });

    const filter = { _id: req.params.id, isDeleted: false };
    if (req.user.role === 'barangay') filter.createdBy = req.user._id;

    const blotter = await Blotter.findOneAndUpdate(
      filter,
      { status, lastUpdated: new Date(), updatedBy: req.user._id },
      { new: true }
    ).populate('barangay').populate('municipality').populate('province');

    if (!blotter) return res.status(404).json({ message: 'Blotter not found' });

    await AuditLog.create({
      action: 'UPDATE_STATUS',
      performedBy: req.user._id,
      targetBlotter: blotter._id,
      details: `Status updated to ${status} for blotter ${blotter.blotterNumber}`,
      ipAddress: req.ip
    });

    res.json(blotter);
  } catch (err) {
    next(err);
  }
};

export const deleteBlotter = async (req, res, next) => {
  try {
    const blotter = await Blotter.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true, deletedAt: new Date(), deletedBy: req.user._id },
      { new: true }
    );
    if (!blotter) return res.status(404).json({ message: 'Blotter not found' });

    await AuditLog.create({
      action: 'DELETE_BLOTTER',
      performedBy: req.user._id,
      targetBlotter: blotter._id,
      details: `Soft deleted blotter ${blotter.blotterNumber}`,
      ipAddress: req.ip
    });

    res.json({ message: 'Blotter deleted successfully' });
  } catch (err) {
    next(err);
  }
};

export const getDashboardStats = async (req, res, next) => {
  try {
    const filter = await scopeFilter(req.user);
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [total, thisMonth, pending, settled, referred] = await Promise.all([
      Blotter.countDocuments(filter),
      Blotter.countDocuments({ ...filter, dateRecorded: { $gte: startOfMonth } }),
      Blotter.countDocuments({ ...filter, status: 'under_mediation' }),
      Blotter.countDocuments({ ...filter, status: { $in: ['settled', 'closed'] } }),
      Blotter.countDocuments({ ...filter, 'barangayAction.endorsedToPNP': true })
    ]);

    // Status breakdown
    const statusAgg = await Blotter.aggregate([
      { $match: filter },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Incident type breakdown
    const typeAgg = await Blotter.aggregate([
      { $match: filter },
      { $group: { _id: '$incident.type', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Monthly trend (last 12 months)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
    twelveMonthsAgo.setDate(1);
    const monthlyAgg = await Blotter.aggregate([
      { $match: { ...filter, dateRecorded: { $gte: twelveMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: '$dateRecorded' }, month: { $month: '$dateRecorded' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      total, thisMonth, pending, settled, referred,
      statusBreakdown: statusAgg.map(s => ({ status: s._id, count: s.count })),
      typeBreakdown: typeAgg.map(t => ({ type: t._id, count: t.count })),
      monthlyTrend: monthlyAgg.map(m => ({
        year: m._id.year, month: m._id.month, count: m.count
      }))
    });
  } catch (err) {
    next(err);
  }
};
