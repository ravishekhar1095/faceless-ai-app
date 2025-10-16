import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = 3001;

// --- Middleware ---
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Middleware to parse JSON bodies

// --- MySQL Database Connection ---
// Use environment variables for database configuration
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  connectTimeout: 30000 // Increase timeout to 30 seconds
};

const pool = mysql.createPool(dbConfig);

// --- API Routes ---

/**
 * @route   POST /api/login
 * @desc    Authenticate user and return success status
 */
app.post('/api/login', async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required.' });
  }

  try {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const user = rows[0];

    // Compare submitted password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      // In a real app, you would generate and return a JWT here
      res.json({ success: true, message: 'Login successful!' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }
  } catch (error) {
    next(error); // Pass error to the centralized handler
  }
});

/**
 * @route   POST /api/register
 * @desc    Register a new user
 */
app.post('/api/register', async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required.' });
  }

  try {
    // Check if username already exists
    const [existingUsers] = await pool.execute('SELECT id FROM users WHERE username = ?', [username]);
    if (existingUsers.length > 0) {
      return res.status(409).json({ success: false, message: 'Username already taken.' });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert the new user into the users table
    const [result] = await pool.execute('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
    const newUserId = result.insertId;

    // Create a corresponding entry in the credit_manage table
    await pool.execute('INSERT INTO credit_manage (user_id, credits) VALUES (?, ?)', [newUserId, 100]);
    res.status(201).json({ success: true, message: 'Registration successful! Please log in.' });
  } catch (error) {
    next(error); // Pass error to the centralized handler
  }
});

/**
 * @route   GET /api/admin/users
 * @desc    Get all users (for admin panel)
 */
app.get('/api/admin/users', async (req, res, next) => {
  // In a real app, this route should be protected to ensure only admins can access it.
  try {
    // Use the JOIN query to get user data and credits
    const [users] = await pool.execute(`
      SELECT u.id, u.username, u.email, u.created_at, cm.credits 
      FROM users u 
      LEFT JOIN credit_manage cm ON u.id = cm.user_id
    `);
    res.json(users);
  } catch (error) {
    next(error); // Pass error to the centralized handler
  }
});

/**
 * @route   DELETE /api/admin/users/:id
 * @desc    Delete a user by ID
 */
app.delete('/api/admin/users/:id', async (req, res, next) => {
  const { id } = req.params;
  const adminUsername = 'admin'; // In a real app, get this from the authenticated admin's session/token

  // In a real app, you might want to prevent an admin from deleting their own account.
  try {
    // First, get user details for logging before deleting
    const [users] = await pool.execute('SELECT username FROM users WHERE id = ?', [id]);
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    const targetUsername = users[0].username;

    const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Log the action
    await pool.execute(
      'INSERT INTO audit_logs (admin_username, action, target_user_id, details) VALUES (?, ?, ?, ?)',
      [adminUsername, 'DELETE_USER', id, `Deleted user: ${targetUsername}`]
    );

    res.json({ success: true, message: 'User deleted successfully.' });
  } catch (error) {
    next(error); // Pass error to the centralized handler
  }
});

/**
 * @route   PUT /api/admin/users/:id/credits
 * @desc    Update a user's credits
 */
app.put('/api/admin/users/:id/credits', async (req, res, next) => {
  const { id } = req.params;
  const { credits } = req.body;
  const adminUsername = 'admin'; // In a real app, get this from the authenticated admin's session/token

  if (credits === undefined || isNaN(credits)) {
    return res.status(400).json({ success: false, message: 'Valid credit amount is required.' });
  }

  try {
    // Update the credits in the credit_manage table using the user_id
    await pool.execute('UPDATE credit_manage SET credits = ? WHERE user_id = ?', [credits, id]);

    // Log the action
    await pool.execute(
      'INSERT INTO audit_logs (admin_username, action, target_user_id, details) VALUES (?, ?, ?, ?)',
      [adminUsername, 'UPDATE_CREDITS', id, `Set credits to ${credits}`]
    );

    res.json({ success: true, message: 'Credits updated successfully.' });
  } catch (error) {
    next(error); // Pass error to the centralized handler
  }
});

/**
 * @route   GET /api/admin/logs
 * @desc    Get all audit logs
 */
app.get('/api/admin/logs', async (req, res, next) => {
  try {
    const [logs] = await pool.execute('SELECT * FROM audit_logs ORDER BY created_at DESC');
    res.json(logs);
  } catch (error) {
    next(error); // Pass error to the centralized handler
  }
});

// --- Centralized Error Handler ---
// This should be the last middleware added.
app.use((err, req, res, next) => {
  console.error(`[${req.method} ${req.path}]`, err);
  // Avoid sending stack trace in production
  const isProd = process.env.NODE_ENV === 'production';
  const message = isProd ? 'An internal server error occurred.' : err.message;
  res.status(500).json({ success: false, message });
});

async function testDbConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connection successful!');
    connection.release();
  } catch (error) {
    console.error('❌ Could not connect to the database.');
    console.error('Please check your .env file and database credentials.');
    console.error(error.message);
  }
}

// --- Start Server ---
app.listen(port, () => {
  console.log(`🚀 Backend server running at http://localhost:${port}`);
  testDbConnection();
});