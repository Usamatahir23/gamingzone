import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Brain, Zap, AlertCircle } from 'lucide-react'

interface PatternMemoryProps {
  onComplete: (score: number) => void
  playerName: string
  playerId: string
}

const PatternMemory: React.FC<PatternMemoryProps> = ({ onComplete }) => {
  const [pattern, setPattern] = useState<number[]>([])
  const [playerPattern, setPlayerPattern] = useState<number[]>([])
  const [isShowingPattern, setIsShowingPattern] = useState(false)
  const [isPlayerTurn, setIsPlayerTurn] = useState(false)
  const [level, setLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [activeTile, setActiveTile] = useState<number | null>(null)

  const gridSize = 16 // 4x4 grid

  useEffect(() => {
    startNewLevel()
  }, [])

  const startNewLevel = () => {
    const newPattern = [...pattern, Math.floor(Math.random() * gridSize)]
    setPattern(newPattern)
    setPlayerPattern([])
    setIsShowingPattern(true)
    setIsPlayerTurn(false)
    showPattern(newPattern)
  }

  const showPattern = async (patternToShow: number[]) => {
    for (let i = 0; i < patternToShow.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600))
      setActiveTile(patternToShow[i])
      await new Promise(resolve => setTimeout(resolve, 400))
      setActiveTile(null)
    }
    setIsShowingPattern(false)
    setIsPlayerTurn(true)
  }

  const handleTileClick = (index: number) => {
    if (!isPlayerTurn || isShowingPattern) return

    const newPlayerPattern = [...playerPattern, index]
    setPlayerPattern(newPlayerPattern)
    setActiveTile(index)

    setTimeout(() => setActiveTile(null), 200)

    // Check if the clicked tile is correct
    if (pattern[newPlayerPattern.length - 1] !== index) {
      endGame()
      return
    }

    // Check if the pattern is complete
    if (newPlayerPattern.length === pattern.length) {
      const points = level * 15
      setScore(score + points)
      setLevel(level + 1)
      setIsPlayerTurn(false)
      
      setTimeout(() => {
        startNewLevel()
      }, 1000)
    }
  }

  const endGame = () => {
    setGameOver(true)
    setIsPlayerTurn(false)
    onComplete(score)
  }

  const resetGame = () => {
    setPattern([])
    setPlayerPattern([])
    setIsShowingPattern(false)
    setIsPlayerTurn(false)
    setLevel(1)
    setScore(0)
    setGameOver(false)
    startNewLevel()
  }

  return (
    <Card className="bg-gray-800/90 backdrop-blur-sm border-gray-700">
      <CardHeader>
        <CardTitle className="text-2xl text-white flex items-center justify-center gap-2">
          <Brain className="w-6 h-6 text-cyan-400" />
          Pattern Memory
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Score and Level */}
        <div className="flex justify-center gap-8">
          <div className="text-center">
            <p className="text-gray-400 text-sm">Score</p>
            <p className="text-2xl font-bold text-white">{score}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm">Level</p>
            <p className="text-2xl font-bold text-white">{level}</p>
          </div>
        </div>

        {/* Status */}
        <div className="text-center">
          <p className="text-lg text-gray-300">
            {isShowingPattern && 'Watch the pattern...'}
            {isPlayerTurn && 'Your turn! Repeat the pattern'}
            {gameOver && 'Game Over!'}
            {!isShowingPattern && !isPlayerTurn && !gameOver && 'Get ready...'}
          </p>
        </div>

        {/* Game Grid */}
        <div className="flex justify-center">
          <div className="grid grid-cols-4 gap-2 bg-gray-900/50 p-4 rounded-lg border border-gray-700">
            {Array.from({ length: gridSize }).map((_, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: isPlayerTurn ? 1.05 : 1 }}
                whileTap={{ scale: isPlayerTurn ? 0.95 : 1 }}
                onClick={() => handleTileClick(index)}
                disabled={!isPlayerTurn || isShowingPattern}
                className={`
                  w-16 h-16 rounded-lg transition-all
                  ${activeTile === index 
                    ? 'bg-cyan-500 shadow-lg shadow-cyan-500/50' 
                    : 'bg-gray-700'
                  }
                  ${isPlayerTurn && !isShowingPattern 
                    ? 'hover:bg-gray-600 cursor-pointer' 
                    : 'cursor-not-allowed'
                  }
                  border border-gray-600
                `}
              >
                {activeTile === index && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-full h-full flex items-center justify-center"
                  >
                    <Zap className="w-8 h-8 text-white" />
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Game Over State */}
        {gameOver && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <div className="flex items-center justify-center gap-2 text-red-400">
              <AlertCircle className="w-6 h-6" />
              <p className="text-xl font-bold">Wrong Pattern!</p>
            </div>
            <p className="text-white">Final Score: {score}</p>
            <p className="text-gray-300">You reached level {level}</p>
            <Button onClick={resetGame} className="bg-cyan-500 hover:bg-cyan-600">
              Try Again
            </Button>
          </motion.div>
        )}

        {/* Instructions */}
        <div className="text-center text-sm text-gray-400 space-y-1">
          <p>🧠 Watch the glowing pattern carefully</p>
          <p>🎯 Repeat it in the same order</p>
          <p>⚡ Level {level} = {level * 15} points</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default PatternMemory