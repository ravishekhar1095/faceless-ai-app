import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import session from 'express-session';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = 3001;

// --- Middleware ---
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.static('public')); // Serve static files from the 'public' directory

// Session Configuration
const FORTY_FIVE_MINUTES = 1000 * 60 * 45;
app.use(session({
  secret: process.env.SESSION_SECRET || 'a-secure-secret-key', // Use an environment variable for this!
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true, // Prevents client-side JS from reading the cookie
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    maxAge: FORTY_FIVE_MINUTES // Session timeout of 45 minutes
  }
}));

// A simple middleware to protect routes
const isAuthenticated = (req, res, next) => req.session.user ? next() : res.status(401).json({ success: false, message: 'Unauthorized' });

// --- MySQL Database Connection ---
// Use environment variables for database configuration
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  connectTimeout: 30000, // Increase timeout to 30 seconds
  waitForConnections: true, // Wait for a connection to become available
  connectionLimit: 10, // Max number of connections in the pool
  queueLimit: 0 // Unlimited queueing
};

const pool = mysql.createPool(dbConfig);

// --- AI and Job Management Setup ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const jobs = {}; // In-memory job store. In production, use a database or Redis.

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
      // Create a session for the user
      req.session.user = {
        id: user.id,
        username: user.username,
        credits: user.credits
      };
      res.json({ success: true, message: 'Login successful!', user: req.session.user });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }
  } catch (error) {
    next(error); // Pass error to the centralized handler
  }
});

/**
 * @route   POST /api/logout
 * @desc    Destroy the user's session
 */
app.post('/api/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Could not log out, please try again.' });
    }
    res.clearCookie('connect.sid'); // The default session cookie name
    res.json({ success: true, message: 'Logout successful.' });
  });
});

/**
 * @route   GET /api/check-session
 * @desc    Check if a user session is active
 */
app.get('/api/check-session', (req, res) => {
  if (req.session.user) {
    res.json({ success: true, user: req.session.user });
  } else {
    res.status(401).json({ success: false, message: 'No active session.' });
  }
});


/**
 * @route   POST /api/register
 * @desc    Register a new user
 */
app.post('/api/register', async (req, res, next) => {
  const { username: email, password } = req.body; // The 'username' from the form is the email

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  try {
    // 1. Generate a unique 4-digit user_id
    let userId;
    let isUnique = false;
    while (!isUnique) {
      userId = Math.floor(1000 + Math.random() * 9000);
      const [existingUser] = await pool.execute('SELECT id FROM users WHERE user_id = ?', [userId]);
      if (existingUser.length === 0) {
        isUnique = true;
      }
    }

    // Extract a username from the email
    const username = email.split('@')[0];

    // Check if username already exists
    const [existingUsers] = await pool.execute('SELECT id FROM users WHERE username = ?', [username]);
    if (existingUsers.length > 0) {
      return res.status(409).json({ success: false, message: 'A user with that username already exists.' });
    }

    // Check if email already exists
    const [existingEmails] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existingEmails.length > 0) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 2. Insert the new user with the unique user_id and default credits
    await pool.execute(
      'INSERT INTO users (user_id, username, email, password, credits) VALUES (?, ?, ?, ?, ?)',
      [userId, username, email, hashedPassword, 10] // Assign 10 credits
    );
    res.status(201).json({ success: true, message: 'Registration successful! Please log in.' });
  } catch (error) {
    next(error); // Pass error to the centralized handler
  }
});

/**
 * @route   GET /api/admin/users
 * @desc    Get all users (for admin panel)
 */
app.get('/api/admin/users', isAuthenticated, async (req, res, next) => {
  // In a real app, this route should be protected to ensure only admins can access it.
  try {
    // Corrected to select from the 'users' table
    const [users] = await pool.execute('SELECT id, username, email, created_at FROM users');
    res.json(users);
  } catch (error) {
    next(error); // Pass error to the centralized handler
  }
});

/**
 * @route   DELETE /api/admin/users/:id
 * @desc    Delete a user by ID
 */
app.delete('/api/admin/users/:id', isAuthenticated, async (req, res, next) => {
  const { id } = req.params;
  const adminUsername = 'admin'; // In a real app, get this from the authenticated admin's session/token

  // In a real app, you might want to prevent an admin from deleting their own account.
  try {
    // Corrected to select from the 'users' table
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
app.put('/api/admin/users/:id/credits', isAuthenticated, async (req, res, next) => {
  const { id } = req.params;
  const { credits } = req.body;
  const adminUsername = 'admin'; // In a real app, get this from the authenticated admin's session/token

  if (credits === undefined || isNaN(credits)) {
    return res.status(400).json({ success: false, message: 'Valid credit amount is required.' });
  }

  try {
    // Update the credits in the credit_manage table using the user's id
    await pool.execute('UPDATE credit_manage SET credits = ? WHERE id = ?', [credits, id]);

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
app.get('/api/admin/logs', isAuthenticated, async (req, res, next) => {
  try {
    const [logs] = await pool.execute('SELECT * FROM audit_logs ORDER BY created_at DESC');
    res.json(logs);
  } catch (error) {
    next(error); // Pass error to the centralized handler
  }
});

/**
 * @route   POST /api/generate-video
 * @desc    Simulates generating a video from a script
 */
app.post('/api/generate-video', (req, res, next) => {
  const { script } = req.body;

  if (!script) {
    return res.status(400).json({ success: false, message: 'Script is required.' });
  }

  const jobId = `job_${Date.now()}`;
  jobs[jobId] = { status: 'pending', script };

  // Immediately respond to the user with the job ID
  res.json({ success: true, jobId });

  // Start the long-running video generation process in the background
  processVideoGeneration(jobId);
});

/**
 * @route   GET /api/video-status/:jobId
 * @desc    Checks the status of a video generation job
 */
app.get('/api/video-status/:jobId', (req, res) => {
  const { jobId } = req.params;
  const job = jobs[jobId];

  if (!job) {
    return res.status(404).json({ success: false, message: 'Job not found.' });
  }

  res.json({ success: true, status: job.status, videoUrl: job.videoUrl });
});


// --- Background Video Generation Logic ---

async function processVideoGeneration(jobId) {
  const job = jobs[jobId];
  try {
    console.log(`[${jobId}] Starting video generation...`);
    jobs[jobId].status = 'processing';

    const prompt = `
      You are a video production assistant. Analyze the following script and break it down into scenes. 
      For each scene, provide a concise set of 3-4 keywords for searching stock video footage.
      Output ONLY a valid JSON object in the format: { "scenes": [{ "text": "...", "keywords": "..." }] }.
      
      Script: "${job.script}"
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const sceneData = JSON.parse(responseText.replace(/```json|```/g, '').trim());

    console.log(`[${jobId}] Scene data generated:`, sceneData);

    // --- SIMULATION of further steps ---
    // In a real app, you would:
    // 1. For each scene, use keywords to search a video API (like Pexels, Shutterstock).
    // 2. Generate Text-to-Speech audio for the script.
    // 3. Use a tool like FFMPEG to stitch the video clips and audio together.
    // 4. Upload the final video to a storage service (like S3) and get a URL.
    await new Promise(resolve => setTimeout(resolve, 5000)); // Simulate work

    jobs[jobId].status = 'complete';
    jobs[jobId].videoUrl = '/login-animation.mp4'; // The final video URL
    console.log(`[${jobId}] Job complete.`);
  } catch (error) {
    console.error(`[${jobId}] Error during video generation:`, error);
    jobs[jobId].status = 'failed';
  }
}

// --- Theme Settings API Routes ---

/**
 * @route   GET /api/theme-settings
 * @desc    Get all theme settings for the frontend
 * @access  Public
 */
app.get('/api/theme-settings', async (req, res, next) => {
  try {
    const [rows] = await pool.execute('SELECT setting_key, setting_value FROM theme_settings');
    const settings = rows.reduce((acc, row) => {
      acc[row.setting_key] = row.setting_value;
      return acc;
    }, {});
    res.json(settings);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /api/admin/theme-settings
 * @desc    Update theme settings from the admin panel
 * @access  Private (Admin)
 */
app.put('/api/admin/theme-settings', isAuthenticated, async (req, res, next) => {
  const settings = req.body; // Expects an object like { key: value, ... }
  try {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    for (const key in settings) {
      await connection.execute(
        'INSERT INTO theme_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)',
        [key, settings[key]]
      );
    }

    await connection.commit();
    connection.release();
    res.json({ success: true, message: 'Theme settings updated successfully.' });
  } catch (error) {
    next(error);
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