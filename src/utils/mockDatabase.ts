// Mock database service for the game portal
// This simulates a backend database with localStorage

interface Player {
  id: string
  name: string
  createdAt: string
  level: number
  totalScore: number
  gamesPlayed: number
  highScore: number
  averageScore: number
}

interface Score {
  id: string
  playerId: string
  gameId: string
  score: number
  createdAt: string
}

class MockDatabaseService {
  private players: Player[] = []
  private scores: Score[] = []

  constructor() {
    this.loadDataFromStorage()
  }

  private loadDataFromStorage() {
    const storedPlayers = localStorage.getItem('gamePortalPlayers')
    const storedScores = localStorage.getItem('gamePortalScores')
    
    if (storedPlayers) {
      this.players = JSON.parse(storedPlayers)
    }
    
    if (storedScores) {
      this.scores = JSON.parse(storedScores)
    }
  }

  private saveDataToStorage() {
    localStorage.setItem('gamePortalPlayers', JSON.stringify(this.players))
    localStorage.setItem('gamePortalScores', JSON.stringify(this.scores))
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9)
  }

  async createPlayer(name: string): Promise<Player> {
    const player: Player = {
      id: this.generateId(),
      name,
      createdAt: new Date().toISOString(),
      level: 1,
      totalScore: 0,
      gamesPlayed: 0,
      highScore: 0,
      averageScore: 0
    }

    this.players.push(player)
    this.saveDataToStorage()
    
    return player
  }

  async getPlayer(id: string): Promise<Player | null> {
    return this.players.find(p => p.id === id) || null
  }

  async getPlayerStats(id: string): Promise<Player | null> {
    const player = this.players.find(p => p.id === id)
    if (!player) return null

    // Calculate stats from scores
    const playerScores = this.scores.filter(s => s.playerId === id)
    
    if (playerScores.length > 0) {
      player.gamesPlayed = playerScores.length
      player.totalScore = playerScores.reduce((sum, score) => sum + score.score, 0)
      player.highScore = Math.max(...playerScores.map(s => s.score))
      player.averageScore = player.totalScore / player.gamesPlayed
      
      // Calculate level based on total score
      player.level = Math.floor(player.totalScore / 100) + 1
    }

    return player
  }

  async saveScore(playerId: string, gameId: string, score: number): Promise<Score> {
    const newScore: Score = {
      id: this.generateId(),
      playerId,
      gameId,
      score,
      createdAt: new Date().toISOString()
    }

    this.scores.push(newScore)
    this.saveDataToStorage()
    
    return newScore
  }

  async getRecentScores(playerId: string, limit: number = 10): Promise<Score[]> {
    return this.scores
      .filter(s => s.playerId === playerId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit)
  }

  async getTopScores(gameId: string, limit: number = 10): Promise<Score[]> {
    return this.scores
      .filter(s => s.gameId === gameId)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
  }

  async getAllPlayers(): Promise<Player[]> {
    return this.players
  }

  async updatePlayer(id: string, updates: Partial<Player>): Promise<Player | null> {
    const playerIndex = this.players.findIndex(p => p.id === id)
    if (playerIndex === -1) return null

    this.players[playerIndex] = { ...this.players[playerIndex], ...updates }
    this.saveDataToStorage()
    
    return this.players[playerIndex]
  }

  async deletePlayer(id: string): Promise<boolean> {
    const playerIndex = this.players.findIndex(p => p.id === id)
    if (playerIndex === -1) return false

    this.players.splice(playerIndex, 1)
    
    // Also delete all scores for this player
    this.scores = this.scores.filter(s => s.playerId !== id)
    
    this.saveDataToStorage()
    return true
  }

  // Utility method to clear all data (for testing)
  async clearAllData(): Promise<void> {
    this.players = []
    this.scores = []
    this.saveDataToStorage()
  }
}

export const mockDatabaseService = new MockDatabaseService()