// This code is a hypothetical example of what might be in your server.js

app.post('/api/login', async (req, res) => {
  // Assuming the frontend still sends a 'username' field
  const { username, password } = req.body;

  // Correct the query to use the 'email' column (or whatever your actual column is)
  const sql = "SELECT * FROM users WHERE email = ?";

  // Use the 'username' variable from the request body to query the 'email' column
  db.query(sql, [username], async (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const user = results[0];
    // ... rest of your login logic (e.g., comparing password)
  });
});
// This code is a hypothetical example of what might be in your server.js

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  // This query is causing the error because the column is not 'username'
  const sql = "SELECT * FROM users WHERE username = ?";

  db.query(sql, [username], async (err, results) => {
    if (err) {
      // The database error would be sent from here
      return res.status(500).json({ message: 'Database error' });
    }
    // ... rest of the login logic
  });
});
users;
/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}