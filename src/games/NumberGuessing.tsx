import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Target } from 'lucide-react'

interface NumberGuessingProps {
  onComplete: (score: number) => void
  playerName: string
  playerId: string
}

const NumberGuessing: React.FC<NumberGuessingProps> = ({ onComplete }) => {
  const [targetNumber, setTargetNumber] = useState(0)
  const [guess, setGuess] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [gameWon, setGameWon] = useState(false)
  const [score, setScore] = useState(0)
  const [hint, setHint] = useState('')

  useEffect(() => {
    startNewGame()
  }, [])

  const startNewGame = () => {
    const newTarget = Math.floor(Math.random() * 100) + 1
    setTargetNumber(newTarget)
    setGuess('')
    setAttempts(0)
    setFeedback('')
    setGameWon(false)
    setHint('Guess a number between 1 and 100')
  }

  const handleGuess = () => {
    const guessNum = parseInt(guess)
    
    if (isNaN(guessNum) || guessNum < 1 || guessNum > 100) {
      setFeedback('Please enter a valid number between 1 and 100')
      return
    }

    const newAttempts = attempts + 1
    setAttempts(newAttempts)

    if (guessNum === targetNumber) {
      setGameWon(true)
      const points = Math.max(100 - (newAttempts * 10), 10)
      setScore(score + points)
      setFeedback(`🎉 Correct! You got it in ${newAttempts} attempts! +${points} points`)
      onComplete(score + points)
    } else if (guessNum < targetNumber) {
      setFeedback('📈 Too low! Try a higher number')
      setHint(`The number is higher than ${guessNum}`)
    } else {
      setFeedback('📉 Too high! Try a lower number')
      setHint(`The number is lower than ${guessNum}`)
    }

    setGuess('')
  }

  return (
    <Card className="bg-gray-800/90 backdrop-blur-sm border-gray-700">
      <CardHeader>
        <CardTitle className="text-2xl text-white flex items-center justify-center gap-2">
          <Target className="w-6 h-6 text-red-400" />
          Number Guessing
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Score and Attempts */}
        <div className="flex justify-center gap-8">
          <div className="text-center">
            <p className="text-gray-400 text-sm">Score</p>
            <p className="text-2xl font-bold text-white">{score}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm">Attempts</p>
            <p className="text-2xl font-bold text-white">{attempts}</p>
          </div>
        </div>

        {/* Game Area */}
        <div className="text-center space-y-4">
          <div className="bg-gray-700/50 rounded-lg p-6 border border-gray-600">
            <p className="text-gray-300 mb-2">{hint}</p>
            <div className="flex gap-2 justify-center">
              <Input
                type="number"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleGuess()}
                placeholder="Enter your guess..."
                className="w-32 bg-gray-600 border-gray-500 text-white text-center text-lg"
                min="1"
                max="100"
                disabled={gameWon}
              />
              <Button
                onClick={handleGuess}
                disabled={gameWon || !guess}
                className="bg-red-500 hover:bg-red-600"
              >
                Guess
              </Button>
            </div>
          </div>

          {/* Feedback */}
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-lg font-semibold ${
                gameWon ? 'text-green-400' : 'text-yellow-400'
              }`}
            >
              {feedback}
            </motion.div>
          )}

          {/* Won State */}
          {gameWon && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="space-y-4"
            >
              <div className="text-4xl">🎊</div>
              <p className="text-gray-300">The number was {targetNumber}</p>
              <Button onClick={startNewGame} className="bg-blue-500 hover:bg-blue-600">
                Play Again
              </Button>
            </motion.div>
          )}

          {/* Instructions */}
          <div className="text-sm text-gray-400 space-y-1">
            <p>🎯 Guess the number between 1-100</p>
            <p>⚡ Fewer attempts = More points!</p>
            <p>🏆 Perfect score: 100 points (1 attempt)</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default NumberGuessing