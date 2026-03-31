const Case        = require('../models/case.model');
const Patient     = require('../models/patient.model');
const Animal      = require('../models/animal.model');
const Vaccination = require('../models/vaccination.model');
const User        = require('../models/user.model');

/**
 * GET /api/notifications/counts
 * Returns today's new record counts for nav badge display.
 * Scoped by role: admin sees all, staff sees only assigned cases.
 */
exports.getNotificationCounts = async (req, res) => {
  try {
    // ── Today's date range (midnight → now) ──────────────────────────────────
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const today = { $gte: startOfDay, $lte: endOfDay };

    // ── Scope cases by role ───────────────────────────────────────────────────
    const caseWhere = req.user.role === 'admin'
      ? {}
      : { assignedTo: req.user.id };

    // Get scoped case IDs for patient/animal/vaccination lookups
    const scopedCases    = await Case.find(caseWhere).select('_id');
    const scopedCaseIds  = scopedCases.map(c => c._id);

    const scopedPatients    = await Patient.find({ caseId: { $in: scopedCaseIds } }).select('_id');
    const scopedPatientIds  = scopedPatients.map(p => p._id);

    // ── Run all counts in parallel ────────────────────────────────────────────
    const [
      newCases,
      newPatients,
      newAnimals,
      newVaccinations,
      newUsers,
    ] = await Promise.all([
      // New cases today (scoped)
      Case.countDocuments({
        ...caseWhere,
        createdAt: today,
      }),

      // New patient records today (scoped via case chain)
      Patient.countDocuments({
        caseId: { $in: scopedCaseIds },
        createdAt: today,
      }),

      // New animal records today (scoped via case chain)
      Animal.countDocuments({
        caseId: { $in: scopedCaseIds },
        createdAt: today,
      }),

      // New vaccination records today (scoped via patient chain)
      Vaccination.countDocuments({
        patientId: { $in: scopedPatientIds },
        createdAt: today,
      }),

      // New users today — admin only, staff gets 0
      req.user.role === 'admin'
        ? User.countDocuments({ createdAt: today })
        : Promise.resolve(0),
    ]);

    res.status(200).json({
      cases:        newCases,
      patients:     newPatients,
      animals:      newAnimals,
      vaccinations: newVaccinations,
      users:        newUsers,
    });
  } catch (error) {
    console.error('[notifications] getNotificationCounts error:', error.message);
    res.status(500).json({ message: error.message });
  }
};