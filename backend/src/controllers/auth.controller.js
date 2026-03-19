const User        = require('../models/user.model');
const jwt         = require('jsonwebtoken');
const logActivity = require('../utils/logActivity'); // ✅ added

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const user  = await User.create({ name, email, password });
    const token = generateToken(user.id);

    // ✅ Log
    await logActivity({
      action: 'CREATE', module: 'User',
      description: `New user registered: ${name} (${email})`,
      user: { id: user.id, name: user.name, role: user.role },
      targetId: user.id, targetName: user.name, req,
    });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id:    user.id,
        name:  user.name,
        email: user.email,
        role:  user.role,
      },
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

    const user = await User.findOne({ where: { email } });
    console.log('User found:', user?.email, '| role:', user?.role);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const isMatch = await user.comparePassword(password);
    console.log('Password match:', isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: 'Wrong password' });
    }

    const token = generateToken(user.id);

    // ✅ Log
    await logActivity({
      action: 'LOGIN', module: 'Auth',
      description: `${user.name} logged in`,
      user: { id: user.id, name: user.name, role: user.role },
      targetId: user.id, targetName: user.name, req,
    });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id:    user.id,
        name:  user.name,
        email: user.email,
        role:  user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Forgot Password — generates a temporary password and saves it
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'No account found with that email.' });
    }

    // Generate 8-character temporary password
    const tempPassword = Math.random().toString(36).slice(-8);

    // Assign plain — beforeUpdate hook will hash it automatically
    user.password = tempPassword;
    await user.save();

    // ✅ Log
    await logActivity({
      action: 'PASSWORD_RESET', module: 'Auth',
      description: `Password reset requested for ${user.name} (${email})`,
      user: { id: user.id, name: user.name, role: user.role },
      targetId: user.id, targetName: user.name, req,
    });

    // ✅ In production: send via nodemailer instead of returning it
    console.log(`Temp password for ${email}: ${tempPassword}`);

    res.status(200).json({
      message: 'Temporary password generated successfully.',
      tempPassword, // ⚠️ Remove this in production — send via email instead
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch)
      return res.status(401).json({ message: 'Current password is incorrect.' });

    if (newPassword.length < 6)
      return res.status(400).json({ message: 'New password must be at least 6 characters.' });

    user.password = newPassword; // beforeUpdate hook hashes it
    await user.save();

    res.json({ message: 'Password updated successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

