# Personalized Learning Recommendation System
[cite_start]Build for: Thinkplus Technical Assessment (AU Campus Recruitment 2026) [cite: 4, 5]

### Deployed Links
- [cite_start]**Frontend (Vercel):** [PASTE_YOUR_VERCEL_URL_HERE] [cite: 19, 115]
- [cite_start]**Backend (Render):** [PASTE_YOUR_RENDER_URL_HERE] [cite: 20, 116]

### [cite_start]AI/ML Logic (Light-Medium Level) [cite: 59, 98]
[cite_start]The system uses **Heuristic-based rules** to adjust learning difficulty[cite: 101, 106]:
1. [cite_start]**Performance Clustering**: It calculates the average score of the last 3 quiz attempts[cite: 89, 100].
2. **Logic**:
   - [cite_start]If Avg > 80: Difficulty = "Increase" (Recommend next tier)[cite: 112, 113].
   - If Avg < 50: Difficulty = "Decrease" (Recommend foundational review).
   - Otherwise: "Stay" at the current level.

### [cite_start]Database Schema [cite: 92, 93]
[cite_start]The PostgreSQL database consists of 4 tables: `users`, `topics`, `quiz_attempts`, and `recommendations`[cite: 94, 95, 96, 97].
