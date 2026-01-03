// Express server for backend API
// This can be deployed separately or used with serverless functions
const express = require('express')
const { Pool } = require('pg')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

// Database connection - use environment variable in production
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost/gamingzone',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
})

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Create player
app.post('/api/players', async (req, res) => {
  try {
    const { name } = req.body
    if (!name) {
      return res.status(400).json({ error: 'Name is required' })
    }

    const result = await pool.query(
      'INSERT INTO players (id, name, avatar, join_date) VALUES (gen_random_uuid(), $1, $2, NOW()) RETURNING *',
      [name, name.charAt(0).toUpperCase()]
    )

    res.json(result.rows[0])
  } catch (error) {
    console.error('Error creating player:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get player by ID
app.get('/api/players/:id', async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query('SELECT * FROM players WHERE id = $1', [id])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Player not found' })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error('Error fetching player:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get player stats
app.get('/api/players/:id/stats', async (req, res) => {
  try {
    const { id } = req.params
    
    // Get player info
    const playerResult = await pool.query('SELECT * FROM players WHERE id = $1', [id])
    if (playerResult.rows.length === 0) {
      return res.status(404).json({ error: 'Player not found' })
    }

    // Get game scores
    const scoresResult = await pool.query(
      'SELECT * FROM game_scores WHERE player_id = $1 ORDER BY played_at DESC',
      [id]
    )

    // Get high scores
    const highScoresResult = await pool.query(
      'SELECT * FROM high_scores WHERE player_id = $1',
      [id]
    )

    const stats = {
      player: playerResult.rows[0],
      totalGames: scoresResult.rows.length,
      totalScore: scoresResult.rows.reduce((sum, score) => sum + score.score, 0),
      averageScore: scoresResult.rows.length > 0 
        ? Math.round(scoresResult.rows.reduce((sum, score) => sum + score.score, 0) / scoresResult.rows.length)
        : 0,
      highScores: highScoresResult.rows.reduce((acc, hs) => {
        acc[hs.game_id] = hs.high_score
        return acc
      }, {}),
      recentScores: scoresResult.rows.slice(0, 10)
    }

    res.json(stats)
  } catch (error) {
    console.error('Error fetching player stats:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Save game score
app.post('/api/scores', async (req, res) => {
  try {
    const { playerId, gameId, score, levelReached, timePlayed } = req.body

    if (!playerId || !gameId || score === undefined) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const result = await pool.query(
      'INSERT INTO game_scores (id, player_id, game_id, score, level_reached, time_played, played_at) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW()) RETURNING *',
      [playerId, gameId, score, levelReached || null, timePlayed || 0]
    )

    // Update high score if needed
    const highScoreResult = await pool.query(
      'SELECT * FROM high_scores WHERE player_id = $1 AND game_id = $2',
      [playerId, gameId]
    )

    if (highScoreResult.rows.length === 0 || score > highScoreResult.rows[0].high_score) {
      if (highScoreResult.rows.length === 0) {
        await pool.query(
          'INSERT INTO high_scores (id, player_id, game_id, high_score, achieved_at) VALUES (gen_random_uuid(), $1, $2, $3, NOW())',
          [playerId, gameId, score]
        )
      } else {
        await pool.query(
          'UPDATE high_scores SET high_score = $1, achieved_at = NOW() WHERE player_id = $2 AND game_id = $3',
          [score, playerId, gameId]
        )
      }
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error('Error saving score:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get leaderboard
app.get('/api/leaderboard', async (req, res) => {
  try {
    const { gameId, limit = 10 } = req.query

    let query = `
      SELECT p.*, hs.high_score, hs.achieved_at
      FROM high_scores hs
      JOIN players p ON hs.player_id = p.id
    `

    const params = []
    if (gameId) {
      query += ' WHERE hs.game_id = $1'
      params.push(gameId)
    }

    query += ' ORDER BY hs.high_score DESC LIMIT $' + (params.length + 1)
    params.push(parseInt(limit))

    const result = await pool.query(query, params)
    res.json(result.rows)
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = app

