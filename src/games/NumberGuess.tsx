import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Target, RotateCcw, Trophy } from 'lucide-react'

interface Props {
  onComplete: (score: number) => void
}

export default function NumberGuess({ onComplete }: Props) {
  const [targetNumber, setTargetNumber] = useState(() => Math.floor(Math.random() * 100) + 1)
  const [guess, setGuess] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [gameWon, setGameWon] = useState(false)
  const [history, setHistory] = useState<{ guess: number; feedback: string }[]>([])

  useEffect(() => {
    if (gameWon) {
      const score = Math.max(1000 - attempts * 50, 100)
      onComplete(score)
    }
  }, [gameWon, attempts, onComplete])

  const handleGuess = () => {
    const guessNum = parseInt(guess)
    
    if (isNaN(guessNum) || guessNum < 1 || guessNum > 100) {
      setFeedback('Please enter a number between 1 and 100')
      return
    }

    const newAttempts = attempts + 1
    setAttempts(newAttempts)

    let feedbackText = ''
    if (guessNum === targetNumber) {
      feedbackText = '🎉 Correct! You got it!'
      setFeedback(feedbackText)
      setGameWon(true)
    } else if (guessNum < targetNumber) {
      feedbackText = '📈 Too low! Try higher'
      setFeedback(feedbackText)
    } else {
      feedbackText = '📉 Too high! Try lower'
      setFeedback(feedbackText)
    }

    setHistory(prev => [...prev, { guess: guessNum, feedback: feedbackText }])
    setGuess('')
  }

  const resetGame = () => {
    setTargetNumber(Math.floor(Math.random() * 100) + 1)
    setGuess('')
    setAttempts(0)
    setFeedback('')
    setGameWon(false)
    setHistory([])
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Number Guessing Game
            </span>
            <Button onClick={resetGame} className="bg-purple-600 hover:bg-purple-700">
              <RotateCcw className="w-4 h-4 mr-2" />
              New Game
            </Button>
          </CardTitle>
          <div className="text-white">
            <p>Guess the number between 1 and 100</p>
            <p className="text-sm opacity-80">Attempts: {attempts}</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="number"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="Enter your guess"
              className="bg-white/10 border-white/20 text-white placeholder-white/50"
              disabled={gameWon}
              onKeyPress={(e) => e.key === 'Enter' && handleGuess()}
            />
            <Button onClick={handleGuess} disabled={gameWon} className="bg-purple-600 hover:bg-purple-700">
              Guess
            </Button>
          </div>

          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3 rounded-lg text-center ${
                gameWon ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
              }`}
            >
              {feedback}
            </motion.div>
          )}

          {history.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-white font-semibold">History:</h3>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {history.map((item, index) => (
                  <div key={index} className="text-white/80 text-sm">
                    Guess {item.guess}: {item.feedback}
                  </div>
                ))}
              </div>
            </div>
          )}

          {gameWon && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center p-4 bg-green-500/20 rounded-lg"
            >
              <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-white font-bold">You won in {attempts} attempts!</p>
              <p className="text-white/80">Score: {Math.max(1000 - attempts * 50, 100)}</p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}