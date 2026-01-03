import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from './components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'
import { Input } from './components/ui/input'
import { Label } from './components/ui/label'
import { Avatar, AvatarFallback } from './components/ui/avatar'
import { 
  Gamepad2, 
  Trophy, 
  Clock, 
  Target, 
  Zap, 
  Brain, 
  Grid3x3,
  Star,
  LogOut,
  Play,
  BarChart3,
  Medal,
  Palette,
  Keyboard,
  Hand
} from 'lucide-react'

// Import all 10 game components with correct relative paths
import TicTacToe from './games/TicTacToe'
import PatternMemory from './games/PatternMemory'
import QuickMath from './games/QuickMath'
import WordScramble from './games/WordScramble'
import ReactionTime from './games/ReactionTime'
import NumberGuessing from './games/NumberGuessing'
import ColorMatch from './games/ColorMatch'
import SimonSays from './games/SimonSays'
import TypingSpeed from './games/TypingSpeed'
import RockPaperScissors from './games/RockPaperScissors'

// Mock database service
import { mockDatabaseService } from './utils/mockDatabase'

interface Game {
  id: string
  name: string
  icon: React.ReactNode
  description: string
  component: React.ComponentType<any>
  color: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
}

const games: Game[] = [
  {
    id: 'tictactoe',
    name: 'Tic Tac Toe',
    icon: <Grid3x3 className="w-6 h-6" />,
    description: 'Classic strategy game vs AI',
    component: TicTacToe,
    color: 'bg-indigo-500',
    difficulty: 'Easy'
  },
  {
    id: 'pattern-memory',
    name: 'Pattern Memory',
    icon: <Brain className="w-6 h-6" />,
    description: 'Test your memory skills',
    component: PatternMemory,
    color: 'bg-cyan-500',
    difficulty: 'Medium'
  },
  {
    id: 'quick-math',
    name: 'Quick Math',
    icon: <Target className="w-6 h-6" />,
    description: 'Solve math problems fast',
    component: QuickMath,
    color: 'bg-orange-500',
    difficulty: 'Medium'
  },
  {
    id: 'word-scramble',
    name: 'Word Scramble',
    icon: <Zap className="w-6 h-6" />,
    description: 'Unscramble words quickly',
    component: WordScramble,
    color: 'bg-green-500',
    difficulty: 'Easy'
  },
  {
    id: 'reaction-time',
    name: 'Reaction Time',
    icon: <Clock className="w-6 h-6" />,
    description: 'Test your reflexes',
    component: ReactionTime,
    color: 'bg-purple-500',
    difficulty: 'Easy'
  },
  {
    id: 'number-guessing',
    name: 'Number Guessing',
    icon: <Target className="w-6 h-6" />,
    description: 'Guess the mystery number',
    component: NumberGuessing,
    color: 'bg-red-500',
    difficulty: 'Easy'
  },
  {
    id: 'color-match',
    name: 'Color Match',
    icon: <Palette className="w-6 h-6" />,
    description: 'Match colors to names',
    component: ColorMatch,
    color: 'bg-pink-500',
    difficulty: 'Medium'
  },
  {
    id: 'simon-says',
    name: 'Simon Says',
    icon: <Brain className="w-6 h-6" />,
    description: 'Memory pattern game',
    component: SimonSays,
    color: 'bg-indigo-500',
    difficulty: 'Hard'
  },
  {
    id: 'typing-speed',
    name: 'Typing Speed',
    icon: <Keyboard className="w-6 h-6" />,
    description: 'Test your typing skills',
    component: TypingSpeed,
    color: 'bg-teal-500',
    difficulty: 'Medium'
  },
  {
    id: 'rock-paper-scissors',
    name: 'Rock Paper Scissors',
    icon: <Hand className="w-6 h-6" />,
    description: 'Classic hand game vs AI',
    component: RockPaperScissors,
    color: 'bg-amber-500',
    difficulty: 'Easy'
  }
]

// Helper function to get avatar background color based on name
const getAvatarColor = (name: string) => {
  const colors = [
    'bg-red-500',
    'bg-blue-500', 
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-cyan-500',
    'bg-orange-500',
    'bg-teal-500'
  ]
  
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  return colors[Math.abs(hash) % colors.length]
}

// Helper function to get first letter and capitalize
const getInitial = (name: string) => {
  if (!name) return '?'
  return name.charAt(0).toUpperCase()
}

export default function App() {
  const [currentGame, setCurrentGame] = useState<Game | null>(null)
  const [playerName, setPlayerName] = useState('')
  const [playerId, setPlayerId] = useState('')
  const [isRegistered, setIsRegistered] = useState(false)
  const [playerStats, setPlayerStats] = useState<any>(null)
  const [recentScores, setRecentScores] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check if player is already logged in (from localStorage)
    const savedPlayerId = localStorage.getItem('playerId')
    const savedPlayerName = localStorage.getItem('playerName')
    
    if (savedPlayerId && savedPlayerName) {
      setPlayerId(savedPlayerId)
      setPlayerName(savedPlayerName)
      setIsRegistered(true)
      loadPlayerData(savedPlayerId)
    }
  }, [])

  const loadPlayerData = async (id: string) => {
    setIsLoading(true)
    try {
      const stats = await mockDatabaseService.getPlayerStats(id)
      const scores = await mockDatabaseService.getRecentScores(id, 5)
      
      setPlayerStats(stats)
      setRecentScores(scores)
    } catch (error) {
      console.error('Error loading player data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!playerName.trim()) return

    setIsLoading(true)
    try {
      const player = await mockDatabaseService.createPlayer(playerName.trim())
      setPlayerId(player.id)
      setIsRegistered(true)
      
      // Save to localStorage for persistence
      localStorage.setItem('playerId', player.id)
      localStorage.setItem('playerName', player.name)
      
      await loadPlayerData(player.id)
    } catch (error) {
      console.error('Error registering player:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGameComplete = async (score: number) => {
    if (!currentGame || !playerId) return

    try {
      await mockDatabaseService.saveScore(playerId, currentGame.id, score)
      await loadPlayerData(playerId)
    } catch (error) {
      console.error('Error saving score:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('playerId')
    localStorage.removeItem('playerName')
    setPlayerId('')
    setPlayerName('')
    setIsRegistered(false)
    setPlayerStats(null)
    setRecentScores([])
    setCurrentGame(null)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400 bg-green-400/10'
      case 'Medium': return 'text-yellow-400 bg-yellow-400/10'
      case 'Hard': return 'text-red-400 bg-red-400/10'
      default: return 'text-gray-400 bg-gray-400/10'
    }
  }

  if (currentGame) {
    const GameComponent = currentGame.component
    return (
      <div className="min-h-screen bg-black">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Button
              onClick={() => setCurrentGame(null)}
              className="mb-4 bg-gray-800 hover:bg-gray-700 text-white"
            >
              ← Back to Games
            </Button>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className={getAvatarColor(playerName)}>
                    {getInitial(playerName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-white font-semibold">{playerName}</p>
                  <p className="text-gray-400 text-sm">Level {playerStats?.level || 1}</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-gray-400 text-sm">Total Score</p>
                <p className="text-2xl font-bold text-white">{playerStats?.totalScore || 0}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <GameComponent
              onComplete={handleGameComplete}
              playerName={playerName}
              playerId={playerId}
            />
          </motion.div>
        </div>
      </div>
    )
  }

  if (!isRegistered) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="text-center">
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
              >
                <Gamepad2 className="w-8 h-8 text-white" />
              </motion.div>
              <CardTitle className="text-2xl text-white">Game Portal</CardTitle>
              <p className="text-gray-400">Enter your name to start playing</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-white">Your Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Enter your name"
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading || !playerName.trim()}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  {isLoading ? 'Creating Profile...' : 'Start Playing'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-14 h-14">
                <AvatarFallback className={getAvatarColor(playerName)}>
                  {getInitial(playerName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-white">Welcome, {playerName}!</h1>
                <p className="text-gray-400">Level {playerStats?.level || 1} Player</p>
              </div>
            </div>
            
            <Button
              onClick={handleLogout}
              variant="outline"
              className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gray-900 rounded-lg p-4 border border-gray-800"
            >
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8 text-yellow-400" />
                <div>
                  <p className="text-gray-400 text-sm">Total Score</p>
                  <p className="text-2xl font-bold text-white">{playerStats?.totalScore || 0}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gray-900 rounded-lg p-4 border border-gray-800"
            >
              <div className="flex items-center gap-3">
                <Star className="w-8 h-8 text-blue-400" />
                <div>
                  <p className="text-gray-400 text-sm">High Score</p>
                  <p className="text-2xl font-bold text-white">{playerStats?.highScore || 0}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gray-900 rounded-lg p-4 border border-gray-800"
            >
              <div className="flex items-center gap-3">
                <Play className="w-8 h-8 text-green-400" />
                <div>
                  <p className="text-gray-400 text-sm">Games Played</p>
                  <p className="text-2xl font-bold text-white">{playerStats?.gamesPlayed || 0}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gray-900 rounded-lg p-4 border border-gray-800"
            >
              <div className="flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-purple-400" />
                <div>
                  <p className="text-gray-400 text-sm">Average Score</p>
                  <p className="text-2xl font-bold text-white">{Math.round(playerStats?.averageScore || 0)}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Games Grid - ALL 10 GAMES */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
        >
          {games.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card 
                className="bg-gray-900 border-gray-800 cursor-pointer hover:border-gray-700 transition-all hover:shadow-xl hover:shadow-purple-500/20"
                onClick={() => setCurrentGame(game)}
              >
                <CardHeader className="text-center pb-3">
                  <div className={`w-16 h-16 mx-auto rounded-full ${game.color} flex items-center justify-center mb-3`}>
                    {game.icon}
                  </div>
                  <CardTitle className="text-white text-lg">{game.name}</CardTitle>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(game.difficulty)}`}>
                    {game.difficulty}
                  </span>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-400 text-sm mb-3">{game.description}</p>
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    Play Now
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Recent Scores */}
        {recentScores.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Medal className="w-6 h-6 text-yellow-400" />
              Recent Scores
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentScores.map((score, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="bg-gray-900 rounded-lg p-4 border border-gray-800"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-white font-semibold">
                        {games.find(g => g.id === score.gameId)?.name || 'Unknown Game'}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {new Date(score.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-green-400">+{score.score}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}