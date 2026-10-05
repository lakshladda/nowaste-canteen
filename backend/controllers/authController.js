const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('crypto');
const { getDB, saveDB } = require('../config/db');
const { signToken } = require('../middleware/auth');

const generateId = () => 'usr-' + Math.random().toString(36).substring(2, 9);

// POST /api/auth/register
const register = (req, res) => {
  try {
    const { name, email, password, role, canteenName } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const db = getDB();
    const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ message: 'A user with this email already exists' });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = {
      id: generateId(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: role === 'canteen_admin' ? 'canteen_admin' : 'student',
      canteenName: role === 'canteen_admin' ? (canteenName || 'Campus Canteen') : null,
      points: 20, // Welcome bonus points!
      createdAt: new Date().toISOString()
    };

    db.users.push(newUser);
    saveDB();

    const token = signToken(newUser);
    const { password: _, ...userSafe } = newUser;

    return res.status(201).json({
      message: 'Account registered successfully',
      token,
      user: userSafe
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Registration failed' });
  }
};

// POST /api/auth/login
const login = (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const db = getDB();
    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = signToken(user);
    const { password: _, ...userSafe } = user;

    return res.json({
      message: 'Logged in successfully',
      token,
      user: userSafe
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Login failed' });
  }
};

// GET /api/auth/me
const getMe = (req, res) => {
  const db = getDB();
  const user = db.users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  const { password: _, ...userSafe } = user;
  return res.json({ user: userSafe });
};

// GET /api/auth/leaderboard
const getLeaderboard = (req, res) => {
  const db = getDB();
  const students = db.users
    .filter(u => u.role === 'student')
    .sort((a, b) => (b.points || 0) - (a.points || 0))
    .slice(0, 10)
    .map((u, index) => {
      let badge = '🥉 Food Saver';
      if (index === 0 || u.points >= 500) badge = '🥇 Zero Waste Champion';
      else if (index === 1 || u.points >= 350) badge = '🥈 Waste Warrior';

      return {
        id: u.id,
        name: u.name,
        points: u.points || 0,
        badge,
        rank: index + 1
      };
    });

  return res.json({ leaderboard: students });
};

module.exports = {
  register,
  login,
  getMe,
  getLeaderboard
};
