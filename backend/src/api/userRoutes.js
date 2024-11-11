import express from 'express';
import bcrypt from 'bcrypt';
import { authenticate } from '../middleware/authentication.js';
import { User } from '../models/user.js';
import { Role } from '../models/role.js';

const router = express.Router();

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user in the database by email
    const user = await User.findOne({ email }).populate('role');
    if (!user) {
      return res.status(400).json({ message: 'User not found.' });
    }

    // Compare the submitted password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password.' });
    }

    // If the user is verified, initialize the session
    req.session.userId = user._id;
    req.session.user = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role.name, // Store role for later use if needed
    };

    // Send a successful login response
    res.json({ message: 'User logged in successfully.', session: req.session });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login process error.' });
  }
});

// Register route
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Additional validations for password
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered.' });
    }


    // Check if 'admin' role exists, if not, create it
    let role = await Role.findOne({ name: 'admin' });
    if (!role) {
      role = new Role({ name: 'admin' });
      await role.save();
      console.log('Admin role created');
    }

    // Create a new user with the 'public' 'admin' role
    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
      role: role._id, // Automatically assign 'admin' role
    });

    // Save the user to the database
    await newUser.save();

    // Send a successful response
    res.status(201).json({ message: 'User created successfully.' });
  } catch (error) {
    console.error('User creation process error:', error);
    res.status(500).json({ message: 'User creation process error.' });
  }
});

// Logout route
router.get('/logout', authenticate, async (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ message: 'Logout process error.' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully.' });
  });
});

// Check authentication status
router.get('/check-auth', (req, res) => {
  if (req.session.userId) {
    res.json({ isLoggedIn: true, user: req.session.user });
  } else {
    res.json({ isLoggedIn: false });
  }
});

// Get user information endpoint
router.get('/me', authenticate, async (req, res) => {
  try {
    // Get the user ID from the session
    const userId = req.session.userId;

    // Find the user in the database and include role information
    const user = await User.findById(userId).populate('role').select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Return user information (excluding password)
    res.json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role.name,
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Error fetching user data.' });
  }
});

export default router;
