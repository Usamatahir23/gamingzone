import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Brain, Volume2 } from 'lucide-react'

interface SimonSaysProps {
  onComplete: (score: number) => void
  playerName: string
  playerId: string
}

const SimonSays: React.FC<SimonSaysProps> = ({ onComplete }) => {
  const colors = [
    { id: 1, color: 'bg-red-500', sound: '🔴' },
    { id: 2, color: 'bg-blue-500', sound: '🔵' },
    { id: 3, color: 'bg-green-500', sound: '🟢' },
    { id: 4, color: 'bg-yellow-500', sound: '🟡' }
  ]

  const [sequence, setSequence] = useState<number[]>([])
  const [playerSequence, setPlayerSequence] = useState<number[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [isShowingSequence, setIsShowingSequence] = useState(false)
  const [activeColor, setActiveColor] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [gameOver, setGameOver] = useState(false)

  useEffect(() => {
    if (isShowingSequence && sequence.length > 0) {
      const showSequence = async () => {
        for (let i = 0; i < sequence.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 600))
          setActiveColor(sequence[i])
          await new Promise(resolve => setTimeout(resolve, 400))
          setActiveColor(null)
        }
        setIsShowingSequence(false)
      }
      showSequence()
    }
  }, [isShowingSequence, sequence])

  const startGame = () => {
    setSequence([])
    setPlayerSequence([])
    setIsPlaying(true)
    setGameOver(false)
    setScore(0)
    setLevel(1)
    nextRound()
  }

  const nextRound = () => {
    const nextColor = Math.floor(Math.random() * 4) + 1
    setSequence([...sequence, nextColor])
    setPlayerSequence([])
    setIsShowingSequence(true)
  }

  const handleColorClick = (colorId: number) => {
    if (!isPlaying || isShowingSequence) return

    const newPlayerSequence = [...playerSequence, colorId]
    setPlayerSequence(newPlayerSequence)

    // Check if the clicked color is correct
    if (newPlayerSequence[newPlayerSequence.length - 1] !== sequence[newPlayerSequence.length - 1]) {
      endGame()
      return
    }

    // Check if the sequence is complete
    if (newPlayerSequence.length === sequence.length) {
      const points = level * 10
      setScore(score + points)
      setLevel(level + 1)
      
      setTimeout(() => {
        nextRound()
      }, 1000)
    }
  }

  const endGame = () => {
    setIsPlaying(false)
    setGameOver(true)
    onComplete(score)
  }

  return (
    <Card className="bg-gray-800/90 backdrop-blur-sm border-gray-700">
      <CardHeader>
        <CardTitle className="text-2xl text-white flex items-center justify-center gap-2">
          <Brain className="w-6 h-6 text-indigo-400" />
          Simon Says
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

        {/* Game Board */}
        <div className="flex justify-center">
          {!isPlaying ? (
            <div className="text-center space-y-4">
              <div className="text-6xl">🧠</div>
              <p className="text-gray-300">Test your memory!</p>
              <Button onClick={startGame} className="bg-indigo-500 hover:bg-indigo-600">
                Start Game
              </Button>
              {gameOver && (
                <div className="space-y-2">
                  <p className="text-xl font-bold text-red-400">Game Over!</p>
                  <p className="text-white">Final Score: {score}</p>
                  <Button onClick={startGame} variant="outline" className="bg-gray-700 border-gray-600 text-white">
                    Try Again
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {colors.map((color) => (
                <motion.button
                  key={color.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleColorClick(color.id)}
                  disabled={isShowingSequence}
                  className={`
                    w-24 h-24 rounded-lg transition-all
                    ${color.color}
                    ${activeColor === color.id ? 'brightness-150 scale-110' : 'brightness-75'}
                    ${!isShowingSequence ? 'hover:brightness-100 cursor-pointer' : 'cursor-not-allowed'}
                    shadow-lg
                  `}
                >
                  <span className="text-3xl">{color.sound}</span>
                </motion.button>
              ))}
            </div>
          )}
        </div>

        {/* Status */}
        {isPlaying && (
          <div className="text-center">
            <p className="text-lg text-gray-300">
              {isShowingSequence ? 'Watch the sequence...' : 'Your turn! Repeat the pattern'}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Sequence length: {sequence.length}
            </p>
          </div>
        )}

        {/* Instructions */}
        <div className="text-center text-sm text-gray-400 space-y-1">
          <p>🎯 Watch the pattern and repeat it</p>
          <p>🧠 Each level adds one more color</p>
          <p>⚡ Level {level} = {level * 10} points</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default SimonSays