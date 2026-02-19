const express = require('express');
const cors = require('cors'); // Required to fix the CORS bug
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();

// FIX: This allows your Vercel frontend to talk to this Render backend
app.use(cors()); 
app.use(express.json());

const supabase = createClient(
    process.env.SUPABASE_URL, 
    process.env.SUPABASE_KEY
);

// Problem Statement 2: Heuristic AI Recommendation Logic
app.get('/api/recommendations/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        // Fetch last 3 quiz attempts for the heuristic calculation
        const { data: attempts, error } = await supabase
            .from('quiz_attempts')
            .select('score')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(3);

        if (error) throw error;

        // Fallback if no data is found
        if (!attempts || attempts.length === 0) {
            return res.json({ 
                averageScore: 0, 
                recommendedPath: "Foundational (No data found)" 
            });
        }

        // Heuristic Logic: Calculate average
        const avgScore = attempts.reduce((acc, curr) => acc + curr.score, 0) / attempts.length;

        // Determine Recommendation Path
        let recommendation = "Intermediate";
        if (avgScore > 80) recommendation = "Advanced";
        if (avgScore < 50) recommendation = "Foundational";

        res.json({ 
            averageScore: avgScore, 
            recommendedPath: recommendation 
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database connection failed' });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
