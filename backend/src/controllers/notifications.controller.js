const Case        = require('../models/case.model');
const Patient     = require('../models/patient.model');
const Animal      = require('../models/animal.model');
const Vaccination = require('../models/vaccination.model');
const User        = require('../models/user.model');

// ── In-memory connected users registry (userId → role) ───────────────────────
// Kept for role-based targeting (e.g. getConnectedAdminIds)
const connectedUsers = new Map();

/**
 * Called from server.js socket.on('join') to register user role.
 * So we can target admins specifically.
 */
exports.registerSocketUser = (userId, role) => {
  connectedUsers.set(userId.toString(), role);
};

exports.removeSocketUser = (userId) => {
  connectedUsers.delete(userId.toString());
};

/**
 * Push a notification event to specific users by their IDs.
 * Called internally from other controllers after create actions.
 *
 * @param {object}   io       - Socket.IO server instance
 * @param {string[]} userIds  - Who to notify (pass '*' to broadcast to all)
 * @param {object}   payload  - { type, module, message }
 */
exports.pushToUsers = (io, userIds, payload) => {
  if (!io) return;
  if (userIds === '*') {
    io.emit('new_notification', payload); // broadcast to all
    return;
  }
  userIds.forEach(uid => {
    io.to(uid.toString()).emit('new_notification', payload);
  });
};

/**
 * Helper: get all connected admin user IDs.
 */
exports.getConnectedAdminIds = () => {
  const adminIds = [];
  connectedUsers.forEach((role, uid) => {
    if (role === 'admin') adminIds.push(uid);
  });
  return adminIds;
};

/**
 * GET /api/notifications/counts
 * Initial hydration on page load — scoped counts, excludes self-created records.
 */
exports.getNotificationCounts = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    const today = { $gte: startOfDay, $lte: endOfDay };

    const userId  = req.user.id;
    const isAdmin = req.user.role === 'admin';

    const caseWhere = isAdmin ? {} : { assignedTo: userId };

    const scopedCases      = await Case.find(caseWhere).select('_id');
    const scopedCaseIds    = scopedCases.map(c => c._id);
    const scopedPatients   = await Patient.find({ caseId: { $in: scopedCaseIds } }).select('_id');
    const scopedPatientIds = scopedPatients.map(p => p._id);

    const [newCases, newPatients, newAnimals, newVaccinations, newUsers] = await Promise.all([
      Case.countDocuments({ ...caseWhere, createdAt: today, createdBy: { $ne: userId } }),
      Patient.countDocuments({ caseId: { $in: scopedCaseIds }, createdAt: today }),
      Animal.countDocuments({ caseId: { $in: scopedCaseIds }, createdAt: today, createdBy: { $ne: userId } }),
      Vaccination.countDocuments({ patientId: { $in: scopedPatientIds }, createdAt: today, createdBy: { $ne: userId } }),
      isAdmin ? User.countDocuments({ createdAt: today }) : Promise.resolve(0),
    ]);

    res.status(200).json({
      cases: newCases, patients: newPatients, animals: newAnimals,
      vaccinations: newVaccinations, users: newUsers,
    });
  } catch (error) {
    console.error('[notifications] getNotificationCounts error:', error.message);
    res.status(500).json({ message: error.message });
  }
};