import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Target, Timer, Zap, CheckCircle, XCircle } from 'lucide-react'

interface QuickMathProps {
  onComplete: (score: number) => void
  playerName: string
  playerId: string
}

const QuickMath: React.FC<QuickMathProps> = ({ onComplete }) => {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [isPlaying, setIsPlaying] = useState(false)
  const [correctAnswer, setCorrectAnswer] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [questionsAnswered, setQuestionsAnswered] = useState(0)
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && isPlaying) {
      endGame()
    }
  }, [timeLeft, isPlaying])

  const generateQuestion = () => {
    const operations = ['+', '-', '*', '/']
    const operation = operations[Math.floor(Math.random() * operations.length)]
    let num1, num2, correct

    switch (operation) {
      case '+':
        num1 = Math.floor(Math.random() * 50) + 1
        num2 = Math.floor(Math.random() * 50) + 1
        correct = num1 + num2
        break
      case '-':
        num1 = Math.floor(Math.random() * 50) + 10
        num2 = Math.floor(Math.random() * num1)
        correct = num1 - num2
        break
      case '*':
        num1 = Math.floor(Math.random() * 12) + 1
        num2 = Math.floor(Math.random() * 12) + 1
        correct = num1 * num2
        break
      case '/':
        num2 = Math.floor(Math.random() * 10) + 1
        correct = Math.floor(Math.random() * 10) + 1
        num1 = num2 * correct
        break
      default:
        num1 = 1
        num2 = 1
        correct = 2
    }

    setQuestion(`${num1} ${operation} ${num2}`)
    setCorrectAnswer(correct)
    setAnswer('')
    setFeedback('')
  }

  const startGame = () => {
    setIsPlaying(true)
    setScore(0)
    setTimeLeft(60)
    setQuestionsAnswered(0)
    setStreak(0)
    generateQuestion()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!answer.trim()) return

    const userAnswer = parseFloat(answer)
    const isCorrect = Math.abs(userAnswer - correctAnswer) < 0.01

    if (isCorrect) {
      const points = 5 + Math.floor(streak / 3) * 2
      setScore(score + points)
      setStreak(streak + 1)
      setFeedback(`Correct! +${points} points`)
    } else {
      setStreak(0)
      setFeedback(`Wrong! Answer was ${correctAnswer}`)
    }

    setQuestionsAnswered(questionsAnswered + 1)
    
    setTimeout(() => {
      generateQuestion()
    }, 1500)
  }

  const endGame = () => {
    setIsPlaying(false)
    onComplete(score)
  }

  return (
    <Card className="bg-gray-800/90 backdrop-blur-sm border-gray-700">
      <CardHeader>
        <CardTitle className="text-2xl text-white flex items-center justify-center gap-2">
          <Target className="w-6 h-6 text-orange-400" />
          Quick Math
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats */}
        <div className="flex justify-center gap-6">
          <div className="text-center">
            <p className="text-gray-400 text-sm">Score</p>
            <p className="text-2xl font-bold text-white">{score}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm">Time</p>
            <p className="text-2xl font-bold text-white flex items-center gap-1">
              <Timer className="w-5 h-5 text-yellow-400" />
              {timeLeft}s
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm">Streak</p>
            <p className="text-2xl font-bold text-white flex items-center gap-1">
              <Zap className="w-5 h-5 text-purple-400" />
              {streak}
            </p>
          </div>
        </div>

        {!isPlaying ? (
          <div className="text-center space-y-4">
            <div className="text-6xl">🧮</div>
            <p className="text-gray-300">Test your math skills!</p>
            <Button onClick={startGame} className="bg-orange-500 hover:bg-orange-600">
              Start Game
            </Button>
            {score > 0 && (
              <div className="space-y-2">
                <p className="text-xl font-bold text-white">Final Score: {score}</p>
                <p className="text-gray-300">Questions answered: {questionsAnswered}</p>
                <Button onClick={startGame} variant="outline" className="bg-gray-700 border-gray-600 text-white">
                  Play Again
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Question */}
            <div className="text-center">
              <div className="bg-gray-900/50 rounded-lg p-8 border border-gray-700">
                <p className="text-4xl font-bold text-white mb-6">{question} = ?</p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    type="number"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Enter your answer"
                    className="w-32 mx-auto bg-gray-700 border-gray-600 text-white text-center text-xl"
                    autoFocus
                  />
                  <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
                    Submit
                  </Button>
                </form>
              </div>
            </div>

            {/* Feedback */}
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-center text-lg font-semibold flex items-center justify-center gap-2 ${
                  feedback.includes('Correct') ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {feedback.includes('Correct') ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <XCircle className="w-5 h-5" />
                )}
                {feedback}
              </motion.div>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="text-center text-sm text-gray-400 space-y-1">
          <p>🧮 Solve math problems as fast as you can</p>
          <p>⚡ Build streaks for bonus points</p>
          <p>⏱️ 60 seconds to get the highest score</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default QuickMath