-- Players Table
CREATE TABLE IF NOT EXISTS players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) UNIQUE NOT NULL,
  avatar VARCHAR(10),
  join_date TIMESTAMP DEFAULT NOW(),
  total_play_time INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1
);

-- Game Scores Table
CREATE TABLE IF NOT EXISTS game_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  game_id VARCHAR(50) NOT NULL,
  score INTEGER NOT NULL,
  level_reached INTEGER,
  time_played INTEGER,
  played_at TIMESTAMP DEFAULT NOW()
);

-- High Scores Table
CREATE TABLE IF NOT EXISTS high_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  game_id VARCHAR(50) NOT NULL,
  high_score INTEGER NOT NULL,
  achieved_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(player_id, game_id)
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_game_scores_player_id ON game_scores(player_id);
CREATE INDEX IF NOT EXISTS idx_game_scores_game_id ON game_scores(game_id);
CREATE INDEX IF NOT EXISTS idx_high_scores_player_id ON high_scores(player_id);
CREATE INDEX IF NOT EXISTS idx_high_scores_game_id ON high_scores(game_id);

