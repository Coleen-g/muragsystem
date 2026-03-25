const User        = require('../models/user.model');
const jwt         = require('jsonwebtoken');
const logActivity = require('../utils/logActivity');
const sendEmail   = require('../utils/sendEmail');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'Email already in use' });

    const user = await User.create({ name, email, password });

    // Mark online immediately after registration
    user.isOnline = true;
    user.lastSeen = new Date();
    await user.save();

    const token = generateToken(user._id);

    await logActivity({
      action: 'CREATE', module: 'User',
      description: `New user registered: ${name} (${email})`,
      user: { id: user._id, name: user.name, role: user.role },
      targetId: user._id, targetName: user.name, req,
    });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, isOnline: user.isOnline, lastSeen: user.lastSeen },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', email);

    const user = await User.findOne({ email });
    console.log('User found:', user?.email, '| role:', user?.role);

    if (!user) return res.status(401).json({ message: 'User not found' });

    const isMatch = await user.comparePassword(password);
    console.log('Password match:', isMatch);

    if (!isMatch) return res.status(401).json({ message: 'Wrong password' });

    // Mark online
    user.isOnline = true;
    user.lastSeen = new Date();
    await user.save();

    const token = generateToken(user._id);

    await logActivity({
      action: 'LOGIN', module: 'Auth',
      description: `${user.name} logged in`,
      user: { id: user._id, name: user.name, role: user.role },
      targetId: user._id, targetName: user.name, req,
    });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, isOnline: user.isOnline, lastSeen: user.lastSeen },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Logout
exports.logout = async (req, res) => {
  try {
    if (req.user) {
      await User.findByIdAndUpdate(req.user.id, {
        isOnline: false,
        lastSeen: new Date(),
      });

      await logActivity({
        action: 'LOGOUT', module: 'Auth',
        description: `${req.user.name} logged out`,
        user: { id: req.user._id, name: req.user.name, role: req.user.role },
        targetId: req.user._id, targetName: req.user.name, req,
      });
    }
    res.json({ message: 'Logged out successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required.' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'No account found with that email.' });

    const tempPassword = Math.random().toString(36).slice(-8);
    user.password = tempPassword;
    await user.save();

    await sendEmail({
      to: email,
      subject: 'iRabiesCare — Password Reset',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #1565C0;">🔐 Password Reset</h2>
          <p>Hello <strong>${user.name || user.email}</strong>,</p>
          <p>Your temporary password for <strong>iRabiesCare</strong> is:</p>
          <div style="background: #f0f9ff; border: 2px solid #1565C0; border-radius: 8px; padding: 16px; text-align: center; margin: 20px 0;">
            <h1 style="color: #1565C0; letter-spacing: 4px; margin: 0;">${tempPassword}</h1>
          </div>
          <p>Please log in and change your password immediately.</p>
          <p style="color: #94a3b8; font-size: 12px;">This is an automated message from iRabiesCare System.</p>
        </div>
      `,
    });

    await logActivity({
      action: 'PASSWORD_RESET', module: 'Auth',
      description: `Password reset for ${user.name} (${email})`,
      user: { id: user._id, name: user.name, role: user.role },
      targetId: user._id, targetName: user.name, req,
    });

    res.status(200).json({ message: 'Temporary password sent to your email.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Change Password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(401).json({ message: 'Current password is incorrect.' });

    if (newPassword.length < 6)
      return res.status(400).json({ message: 'New password must be at least 6 characters.' });

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};