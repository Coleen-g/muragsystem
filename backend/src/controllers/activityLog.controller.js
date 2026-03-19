const { Op } = require('sequelize');
const ActivityLog = require('../models/activityLog.model');

// GET /api/activity — paginated, filterable
exports.getLogs = async (req, res) => {
  try {
    const {
      page     = 1,
      limit    = 20,
      action,
      module,
      search,
      dateFrom,
      dateTo,
      userId,
    } = req.query;

    const where = {};

    if (action  && action  !== 'All') where.action = action;
    if (module  && module  !== 'All') where.module = module;
    if (userId  && userId  !== 'All') where.performedBy = Number(userId);

    if (search) {
      where[Op.or] = [
        { description:     { [Op.like]: `%${search}%` } },
        { targetName:      { [Op.like]: `%${search}%` } },
        { performedByName: { [Op.like]: `%${search}%` } },
      ];
    }

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt[Op.gte] = new Date(dateFrom);
      if (dateTo) {
        const end = new Date(dateTo);
        end.setHours(23, 59, 59, 999);
        where.createdAt[Op.lte] = end;
      }
    }

    const total = await ActivityLog.count({ where });
    const logs  = await ActivityLog.findAll({
      where,
      order: [['createdAt', 'DESC']],
      limit:  Number(limit),
      offset: (page - 1) * limit,
    });

    res.json({
      logs,
      total,
      page:       Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/activity — clear all logs (admin only)
exports.clearLogs = async (req, res) => {
  try {
    await ActivityLog.destroy({ where: {} });
    res.json({ message: 'Activity logs cleared.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};