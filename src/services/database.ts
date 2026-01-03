// Mock Database Service - In production, this would be real API calls
interface Player {
  id: string
  name: string
  avatar: string
  joinDate: string
  totalPlayTime: number
  level: number
}

interface GameScore {
  id: string
  playerId: string
  gameId: string
  score: number
  levelReached: number
  timePlayed: number
  playedAt: string
}

interface HighScore {
  id: string
  playerId: string
  gameId: string
  highScore: number
  achievedAt: string
}

class MockDatabase {
  private players: Player[] = []
  private gameScores: GameScore[] = []
  private highScores: HighScore[] = []

  // Simulate API delay
  private delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Player operations
  async createPlayer(name: string): Promise<Player> {
    await this.delay()
    
    // Check if player already exists
    const existingPlayer = this.players.find(p => p.name.toLowerCase() === name.toLowerCase())
    if (existingPlayer) {
      return existingPlayer
    }

    const newPlayer: Player = {
      id: `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      avatar: name.trim().charAt(0).toUpperCase(),
      joinDate: new Date().toISOString(),
      totalPlayTime: 0,
      level: 1
    }

    this.players.push(newPlayer)
    this.saveToLocalStorage()
    return newPlayer
  }

  async getPlayerByName(name: string): Promise<Player | null> {
    await this.delay()
    return this.players.find(p => p.name.toLowerCase() === name.toLowerCase()) || null
  }

  async getPlayerById(id: string): Promise<Player | null> {
    await this.delay()
    return this.players.find(p => p.id === id) || null
  }

  async updatePlayer(id: string, updates: Partial<Player>): Promise<Player | null> {
    await this.delay()
    const playerIndex = this.players.findIndex(p => p.id === id)
    if (playerIndex === -1) return null

    this.players[playerIndex] = { ...this.players[playerIndex], ...updates }
    this.saveToLocalStorage()
    return this.players[playerIndex]
  }

  // Game score operations
  async addGameScore(score: Omit<GameScore, 'id' | 'playedAt'>): Promise<GameScore> {
    await this.delay()
    
    const newScore: GameScore = {
      id: `score_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...score,
      playedAt: new Date().toISOString()
    }

    this.gameScores.push(newScore)

    // Update high score if needed
    await this.updateHighScore(score.playerId, score.gameId, score.score)

    // Update player's total play time and level
    const player = await this.getPlayerById(score.playerId)
    if (player) {
      const newLevel = Math.floor((player.totalPlayTime + score.timePlayed) / 300) + 1 // Level up every 5 minutes
      await this.updatePlayer(player.id, {
        totalPlayTime: player.totalPlayTime + score.timePlayed,
        level: newLevel
      })
    }

    this.saveToLocalStorage()
    return newScore
  }

  async getPlayerGameHistory(playerId: string, gameId?: string): Promise<GameScore[]> {
    await this.delay()
    let scores = this.gameScores.filter(s => s.playerId === playerId)
    if (gameId) {
      scores = scores.filter(s => s.gameId === gameId)
    }
    return scores.sort((a, b) => new Date(b.playedAt).getTime() - new Date(a.playedAt).getTime())
  }

  async getPlayerStats(playerId: string): Promise<{
    totalGames: number
    totalScore: number
    averageScore: number
    bestGame: string
    totalPlayTime: number
    highScores: Record<string, number>
  }> {
    await this.delay()
    const playerScores = this.gameScores.filter(s => s.playerId === playerId)
    const playerHighScores = this.highScores.filter(hs => hs.playerId === playerId)

    const totalGames = playerScores.length
    const totalScore = playerScores.reduce((sum, s) => sum + s.score, 0)
    const averageScore = totalGames > 0 ? Math.round(totalScore / totalGames) : 0
    const totalPlayTime = playerScores.reduce((sum, s) => sum + s.timePlayed, 0)

    // Find best game
    const gameScores: Record<string, { total: number; count: number }> = {}
    playerScores.forEach(score => {
      if (!gameScores[score.gameId]) {
        gameScores[score.gameId] = { total: 0, count: 0 }
      }
      gameScores[score.gameId].total += score.score
      gameScores[score.gameId].count += 1
    })

    let bestGame = 'None'
    let bestAvgScore = 0
    Object.entries(gameScores).forEach(([gameId, stats]) => {
      const avg = stats.total / stats.count
      if (avg > bestAvgScore) {
        bestAvgScore = avg
        bestGame = gameId
      }
    })

    // Get high scores
    const highScores: Record<string, number> = {}
    playerHighScores.forEach(hs => {
      highScores[hs.gameId] = hs.highScore
    })

    return {
      totalGames,
      totalScore,
      averageScore,
      bestGame,
      totalPlayTime,
      highScores
    }
  }

  // High score operations
  private async updateHighScore(playerId: string, gameId: string, score: number): Promise<void> {
    const existingHighScore = this.highScores.find(
      hs => hs.playerId === playerId && hs.gameId === gameId
    )

    if (!existingHighScore || score > existingHighScore.highScore) {
      if (existingHighScore) {
        existingHighScore.highScore = score
        existingHighScore.achievedAt = new Date().toISOString()
      } else {
        this.highScores.push({
          id: `hs_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          playerId,
          gameId,
          highScore: score,
          achievedAt: new Date().toISOString()
        })
      }
    }
  }

  async getLeaderboard(gameId?: string, limit: number = 10): Promise<{
    player: Player
    highScore: number
  }[]> {
    await this.delay()
    
    let relevantHighScores = this.highScores
    if (gameId) {
      relevantHighScores = this.highScores.filter(hs => hs.gameId === gameId)
    }

    const leaderboard = relevantHighScores
      .sort((a, b) => b.highScore - a.highScore)
      .slice(0, limit)
      .map(hs => ({
        player: this.players.find(p => p.id === hs.playerId)!,
        highScore: hs.highScore
      }))

    return leaderboard
  }

  // LocalStorage persistence (for demo purposes)
  private saveToLocalStorage(): void {
    localStorage.setItem('mockDb_players', JSON.stringify(this.players))
    localStorage.setItem('mockDb_gameScores', JSON.stringify(this.gameScores))
    localStorage.setItem('mockDb_highScores', JSON.stringify(this.highScores))
  }

  private loadFromLocalStorage(): void {
    try {
      const players = localStorage.getItem('mockDb_players')
      const gameScores = localStorage.getItem('mockDb_gameScores')
      const highScores = localStorage.getItem('mockDb_highScores')

      if (players) this.players = JSON.parse(players)
      if (gameScores) this.gameScores = JSON.parse(gameScores)
      if (highScores) this.highScores = JSON.parse(highScores)
    } catch (error) {
      console.error('Error loading from localStorage:', error)
    }
  }

  // Initialize
  constructor() {
    this.loadFromLocalStorage()
  }
}

export const db = new MockDatabase()

// In production, these would be real API calls:
/*
export const api = {
  players: {
    create: (name: string) => fetch('/api/players', { method: 'POST', body: JSON.stringify({ name }) }),
    getByName: (name: string) => fetch(`/api/players/name/${name}`),
      getById: (id: string) => fetch(`/api/players/${id}`),
      update: (id: string, data: any) => fetch(`/api/players/${id}`, { method: 'PUT', body: JSON.stringify(data) })
    },
    scores: {
      add: (score: any) => fetch('/api/scores', { method: 'POST', body: JSON.stringify(score) }),
      getHistory: (playerId: string, gameId?: string) => fetch(`/api/scores/${playerId}?gameId=${gameId}`),
      getStats: (playerId: string) => fetch(`/api/scores/${playerId}/stats`)
    },
    leaderboard: {
      get: (gameId?: string, limit?: number) => fetch(`/api/leaderboard?gameId=${gameId}&limit=${limit}`)
    }
  }
*/