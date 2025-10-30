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
let model = null;
const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY);

if (hasGeminiKey) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  } catch (error) {
    console.warn('Failed to initialize Gemini model. Falling back to local scene generation.', error.message);
  }
} else {
  console.warn('GEMINI_API_KEY not provided. Falling back to local scene generation.');
}

const jobs = {}; // In-memory job store. In production, use a database or Redis.

const DEFAULT_THEME_SETTINGS = Object.freeze({
  hero_title: 'Create Stunning Videos, Effortlessly.',
  hero_subtitle: 'Transform your ideas into captivating AI-generated videos in minutes.',
  primary_color: '#6366f1'
});

function buildFallbackScenes(script = '') {
  const sanitized = script.replace(/\s+/g, ' ').trim();

  if (!sanitized) {
    return [{
      text: 'Introduce Faceless AI and invite viewers to generate their first faceless video.',
      keywords: 'faceless ai intro video'
    }];
  }

  const segments = sanitized
    .split(/(?<=[.!?])\s+|\n+/)
    .map(segment => segment.trim())
    .filter(Boolean);

  const limited = segments.slice(0, 6);

  return limited.map((segment, index) => ({
    text: segment,
    keywords: segment
      .toLowerCase()
      .split(/\W+/)
      .filter(Boolean)
      .slice(0, 5)
      .join(' ') || `scene ${index + 1}`
  }));
}

async function generateScenesFromScript(script) {
  if (!model) {
    return { scenes: buildFallbackScenes(script) };
  }

  try {
    const prompt = `
      You are a video production assistant. Analyze the following script and break it down into scenes.
      For each scene, provide a concise set of 3-4 keywords for searching stock video footage.
      Output ONLY a valid JSON object in the format: { "scenes": [{ "text": "...", "keywords": "..." }] }.

      Script: "${script}"
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const sceneData = JSON.parse(responseText.replace(/```json|```/g, '').trim());

    if (sceneData && Array.isArray(sceneData.scenes) && sceneData.scenes.length > 0) {
      return sceneData;
    }
  } catch (error) {
    console.warn('Gemini scene generation failed. Falling back to local scene builder.', error.message);
  }

  return { scenes: buildFallbackScenes(script) };
}

function deriveJobTitle(originalScript, fallback) {
  const source = (originalScript || fallback || '').replace(/\s+/g, ' ').trim();
  if (!source) {
    return 'Untitled render';
  }
  const firstSentence = source.split(/(?<=[.!?])\s+/)[0] || source.slice(0, 80);
  return firstSentence.length > 80 ? `${firstSentence.slice(0, 77)}…` : firstSentence;
}

async function generateScriptFromIdea(idea) {
  const trimmedIdea = idea.replace(/\s+/g, ' ').trim();
  if (!trimmedIdea) {
    return '';
  }

  if (!model) {
    return buildFallbackScriptFromIdea(trimmedIdea);
  }

  try {
    const prompt = `
      You are a video script writer. Create a short, engaging script based on the idea below.
      The script should include an introduction, two key sections, and a closing call-to-action.
      Keep sentences concise and conversational. Return plain text with paragraph breaks.

      Idea: "${trimmedIdea}"
    `;
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```(?:text)?|```/g, '').trim();
    if (text) {
      return text;
    }
  } catch (error) {
    console.warn('Gemini script generation failed. Falling back to template.', error.message);
  }

  return buildFallbackScriptFromIdea(trimmedIdea);
}

async function generateScriptFromArticle(articleContent) {
  const cleaned = articleContent.replace(/\s+/g, ' ').trim();
  if (!cleaned) {
    return '';
  }

  if (!model) {
    return buildFallbackScriptFromArticle(cleaned);
  }

  try {
    const prompt = `
      You are an expert editor. Convert the article excerpt below into a concise narration script for a 60-90 second video.
      Structure it with: hook, key insights (2-3), and final takeaway / call-to-action.
      Return plain text paragraphs without markdown.

      Article excerpt: "${cleaned}"
    `;
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```(?:text)?|```/g, '').trim();
    if (text) {
      return text;
    }
  } catch (error) {
    console.warn('Gemini article-to-script failed. Falling back to summarizer.', error.message);
  }

  return buildFallbackScriptFromArticle(cleaned);
}

function buildFallbackScriptFromIdea(idea) {
  return [
    `Hook: Imagine ${idea.toLowerCase()} becoming the next big conversation on social feeds.`,
    `Problem: Creators struggle to keep up because ${idea.toLowerCase()} evolves faster than traditional production.`,
    `Solution: With Faceless AI, you can spin up explainer clips about ${idea.toLowerCase()} in minutes, pairing voice, visuals, and captions instantly.`,
    `Call-to-action: Try Faceless AI today and turn ideas like "${idea}" into binge-worthy videos without ever stepping on camera.`
  ].join('\n\n');
}

function buildFallbackScriptFromArticle(articleContent) {
  const sentences = articleContent.split(/(?<=[.!?])\s+/).filter(Boolean);
  const intro = sentences[0] || articleContent.slice(0, 120);
  const insightOne = sentences[1] || 'The landscape is shifting faster than analysts expected.';
  const insightTwo = sentences[2] || 'Teams that adapt now will have the strongest advantage.';
  const closing = sentences[3] || 'Stay ahead by translating research into human stories.';

  return [
    `Hook: ${intro}`,
    `Insight 1: ${insightOne}`,
    `Insight 2: ${insightTwo}`,
    `Takeaway: ${closing}`
  ].join('\n\n');
}

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
 * @desc    Simulates generating a video from a script, idea, or article content
 */
app.post('/api/generate-video', async (req, res, next) => {
  try {
    const {
      mode = 'script',
      script: rawScript = '',
      idea = '',
      article = '',
      voiceStyle = 'professional',
      aspectRatio = '16:9'
    } = req.body;

    let workingScript = '';
    const normalizedMode = ['script', 'idea', 'article'].includes(mode) ? mode : 'script';

    if (normalizedMode === 'script') {
      workingScript = String(rawScript || '').trim();
      if (!workingScript) {
        return res.status(400).json({ success: false, message: 'Please provide a script to generate a video.' });
      }
    } else if (normalizedMode === 'idea') {
      const trimmedIdea = String(idea || rawScript || '').trim();
      if (!trimmedIdea) {
        return res.status(400).json({ success: false, message: 'Share a video idea so we can craft the script.' });
      }
      workingScript = await generateScriptFromIdea(trimmedIdea);
      if (!workingScript) {
        return res.status(500).json({ success: false, message: 'Unable to build a script from that idea. Try again.' });
      }
    } else if (normalizedMode === 'article') {
      const articleContent = String(article || rawScript || '').trim();
      if (!articleContent) {
        return res.status(400).json({ success: false, message: 'Paste article notes to convert into a video script.' });
      }
      workingScript = await generateScriptFromArticle(articleContent);
      if (!workingScript) {
        return res.status(500).json({ success: false, message: 'Unable to summarize that article. Try again.' });
      }
    }

    workingScript = workingScript.trim();

    const jobId = `job_${Date.now()}`;
    jobs[jobId] = {
      id: jobId,
      status: 'pending',
      mode: normalizedMode,
      voiceStyle,
      aspectRatio,
      script: workingScript,
      scenes: [],
      error: null,
      videoUrl: null,
      createdAt: Date.now(),
      completedAt: null,
      title: deriveJobTitle(workingScript)
    };

    // Immediately respond to the user with the job ID
    res.json({ success: true, jobId });

    // Start the long-running video generation process in the background
    processVideoGeneration(jobId);
  } catch (error) {
    next(error);
  }
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

  res.json({
    success: true,
    status: job.status,
    videoUrl: job.videoUrl,
    scenes: job.scenes || [],
    error: job.error || null,
    mode: job.mode,
    title: job.title,
    voiceStyle: job.voiceStyle,
    aspectRatio: job.aspectRatio,
    createdAt: job.createdAt,
    completedAt: job.completedAt
  });
});

/**
 * @route   GET /api/jobs/recent
 * @desc    Returns recent generation jobs for the authenticated user session
 */
app.get('/api/jobs/recent', isAuthenticated, (req, res) => {
  const recentJobs = Object.values(jobs)
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
    .slice(0, 12)
    .map(job => ({
      id: job.id,
      title: job.title || deriveJobTitle(job.script),
      mode: job.mode,
      status: job.status,
      videoUrl: job.videoUrl,
      createdAt: job.createdAt,
      completedAt: job.completedAt,
      voiceStyle: job.voiceStyle,
      aspectRatio: job.aspectRatio
    }));

  res.json(recentJobs);
});


// --- Background Video Generation Logic ---

async function processVideoGeneration(jobId) {
  const job = jobs[jobId];
  if (!job) {
    console.warn(`[${jobId}] Job no longer exists. Skipping generation.`);
    return;
  }
  try {
    console.log(`[${jobId}] Starting video generation...`);
    jobs[jobId].status = 'processing';
    jobs[jobId].error = null;

    const sceneData = await generateScenesFromScript(job.script);
    jobs[jobId].scenes = sceneData.scenes;

    console.log(`[${jobId}] Scene data generated:`, sceneData);

    // --- SIMULATION of further steps ---
    // In a real app, you would:
    // 1. For each scene, use keywords to search a video API (like Pexels, Shutterstock).
    // 2. Generate Text-to-Speech audio for the script.
    // 3. Use a tool like FFMPEG to stitch the video clips and audio together.
    // 4. Upload the final video to a storage service (like S3) and get a URL.
    await new Promise(resolve => setTimeout(resolve, 5000)); // Simulate work

    jobs[jobId].status = 'complete';
    jobs[jobId].videoUrl = '/HD_Video_Generation_Complete.mp4'; // The final video URL
    jobs[jobId].completedAt = Date.now();
    jobs[jobId].title = deriveJobTitle(job.script, jobs[jobId].scenes?.[0]?.text);
    console.log(`[${jobId}] Job complete.`);
  } catch (error) {
    console.error(`[${jobId}] Error during video generation:`, error);
    jobs[jobId].status = 'failed';
    jobs[jobId].error = 'Video generation failed. Please try again.';
    jobs[jobId].completedAt = Date.now();
  }
}

// --- Theme Settings API Routes ---

/**
 * @route   GET /api/theme-settings
 * @desc    Get all theme settings for the frontend
 * @access  Public
 */
app.get('/api/theme-settings', (req, res) => {
  res.json(DEFAULT_THEME_SETTINGS);
});

/**
 * @route   PUT /api/admin/theme-settings
 * @desc    Update theme settings from the admin panel
 * @access  Private (Admin)
 */
app.put('/api/admin/theme-settings', isAuthenticated, (req, res) => {
  res.status(503).json({
    success: false,
    message: 'Theme settings updates are temporarily disabled.'
  });
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
