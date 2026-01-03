import { useState, useEffect } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Palette, Timer, Zap } from 'lucide-react'

interface ColorMatchProps {
  onComplete: (score: number) => void
  playerName: string
  playerId: string
}

const ColorMatch: React.FC<ColorMatchProps> = ({ onComplete }) => {
  const colors = [
    { name: 'Red', value: 'bg-red-500' },
    { name: 'Blue', value: 'bg-blue-500' },
    { name: 'Green', value: 'bg-green-500' },
    { name: 'Yellow', value: 'bg-yellow-500' },
    { name: 'Purple', value: 'bg-purple-500' },
    { name: 'Orange', value: 'bg-orange-500' }
  ]

  const [currentColor, setCurrentColor] = useState('')
  const [colorName, setColorName] = useState('')
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [gameActive, setGameActive] = useState(false)
  const [round, setRound] = useState(0)

  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && gameActive) {
      endGame()
    }
  }, [timeLeft, gameActive])

  const startGame = () => {
    setGameActive(true)
    setScore(0)
    setTimeLeft(30)
    setRound(0)
    generateNewRound()
  }

  const generateNewRound = () => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)]
    const randomName = colors[Math.floor(Math.random() * colors.length)].name
    
    setCurrentColor(randomColor.value)
    setColorName(randomName)
    setRound(round + 1)
  }

  const handleAnswer = (isMatch: boolean) => {
    if (!gameActive) return

    const correct = (currentColor === colors.find(c => c.name === colorName)?.value) === isMatch
    
    if (correct) {
      setScore(score + 5)
    } else {
      setScore(Math.max(0, score - 2))
    }

    if (round < 10) {
      generateNewRound()
    } else {
      endGame()
    }
  }

  const endGame = () => {
    setGameActive(false)
    onComplete(score)
  }

  return (
    <Card className="bg-gray-800/90 backdrop-blur-sm border-gray-700">
      <CardHeader>
        <CardTitle className="text-2xl text-white flex items-center justify-center gap-2">
          <Palette className="w-6 h-6 text-pink-400" />
          Color Match
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!gameActive ? (
          <div className="text-center space-y-4">
            <div className="text-6xl">🎨</div>
            <p className="text-gray-300">Test your color recognition!</p>
            <Button onClick={startGame} className="bg-pink-500 hover:bg-pink-600">
              Start Game
            </Button>
            {score > 0 && (
              <div className="space-y-2">
                <p className="text-2xl font-bold text-white">Final Score: {score}</p>
                <Button onClick={startGame} variant="outline" className="bg-gray-700 border-gray-600 text-white">
                  Play Again
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Timer and Score */}
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <Timer className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-bold">{timeLeft}s</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-400" />
                <span className="text-white font-bold">Score: {score}</span>
              </div>
            </div>

            {/* Game Area */}
            <div className="text-center space-y-6">
              <div className="space-y-4">
                <p className="text-gray-300">Does the color match the name?</p>
                <div className={`w-32 h-32 ${currentColor} rounded-lg mx-auto shadow-lg`}></div>
                <p className="text-3xl font-bold text-white">{colorName}</p>
              </div>

              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => handleAnswer(true)}
                  className="bg-green-500 hover:bg-green-600 px-8"
                >
                  ✓ Match
                </Button>
                <Button
                  onClick={() => handleAnswer(false)}
                  className="bg-red-500 hover:bg-red-600 px-8"
                >
                  ✗ No Match
                </Button>
              </div>

              <p className="text-sm text-gray-400">Round {round}/10</p>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="text-center text-sm text-gray-400 space-y-1">
          <p>🎯 Click if the color matches the word</p>
          <p>⚡ Correct: +5 pts | Wrong: -2 pts</p>
          <p>⏱️ 30 seconds to complete 10 rounds</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default ColorMatch