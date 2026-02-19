const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(require('cors')());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Get this from Supabase Settings -> Database
});

// The "AI" Recommendation Engine logic [cite: 78, 101]
app.post('/api/recommend', async (req, res) => {
  const { user_id } = req.body;

  // 1. Get student's latest performance [cite: 89]
  const attempts = await pool.query(
    'SELECT score FROM quiz_attempts WHERE user_id = $1 ORDER BY timestamp DESC LIMIT 3',
    [user_id]
  );

  const avgScore = attempts.rows.reduce((a, b) => a + b.score, 0) / (attempts.rows.length || 1);

  // 2. Apply Rule-based Logic 
  let adjustment = 'Stay';
  let targetDifficulty = 'Beginner';

  if (avgScore > 80) {
      adjustment = 'Increase';
      targetDifficulty = 'Intermediate'; // Logic to bump them up
  } else if (avgScore < 50) {
      adjustment = 'Decrease';
      targetDifficulty = 'Beginner'; // Logic to review basics
  }

  // 3. Find a recommended topic [cite: 90]
  const topic = await pool.query(
    'SELECT * FROM topics WHERE difficulty = $1 LIMIT 1',
    [targetDifficulty]
  );

  // 4. Return the Expected Output Format [cite: 107, 108, 112]
  res.json({
    student_id: user_id,
    current_level: avgScore > 80 ? "Intermediate" : "Beginner",
    recommended_topic: topic.rows[0]?.title || "General Basics",
    difficulty_adjustment: adjustment
  });
});

app.listen(3001, () => console.log('Server running on port 3001'));