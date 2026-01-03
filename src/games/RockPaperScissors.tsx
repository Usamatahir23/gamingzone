import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Hand, Trophy, RotateCcw } from 'lucide-react'

interface RockPaperScissorsProps {
  onComplete: (score: number) => void
  playerName: string
  playerId: string
}

const RockPaperScissors: React.FC<RockPaperScissorsProps> = ({ onComplete }) => {
  const choices = [
    { id: 'rock', emoji: '✊', name: 'Rock', beats: 'scissors' },
    { id: 'paper', emoji: '✋', name: 'Paper', beats: 'rock' },
    { id: 'scissors', emoji: '✌️', name: 'Scissors', beats: 'paper' }
  ]

  const [playerChoice, setPlayerChoice] = useState('')
  const [computerChoice, setComputerChoice] = useState('')
  const [result, setResult] = useState('')
  const [score, setScore] = useState(0)
  const [wins, setWins] = useState(0)
  const [losses, setLosses] = useState(0)
  const [draws, setDraws] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const playGame = (choice: string) => {
    const compChoice = choices[Math.floor(Math.random() * 3)].id
    setPlayerChoice(choice)
    setComputerChoice(compChoice)
    setIsPlaying(true)

    const player = choices.find(c => c.id === choice)
    const computer = choices.find(c => c.id === compChoice)

    if (choice === compChoice) {
      setResult('draw')
      setDraws(draws + 1)
    } else if (player?.beats === compChoice) {
      setResult('win')
      setWins(wins + 1)
      const points = 5
      setScore(score + points)
      onComplete(score + points)
    } else {
      setResult('lose')
      setLosses(losses + 1)
    }
  }

  const resetRound = () => {
    setPlayerChoice('')
    setComputerChoice('')
    setResult('')
    setIsPlaying(false)
  }

  const resetGame = () => {
    resetRound()
    setScore(0)
    setWins(0)
    setLosses(0)
    setDraws(0)
  }

  const getResultMessage = () => {
    if (result === 'win') return '🎉 You Win! +5 points'
    if (result === 'lose') return '😔 You Lose!'
    if (result === 'draw') return '🤝 It\'s a Draw!'
    return ''
  }

  const getResultColor = () => {
    if (result === 'win') return 'text-green-400'
    if (result === 'lose') return 'text-red-400'
    if (result === 'draw') return 'text-yellow-400'
    return ''
  }

  return (
    <Card className="bg-gray-800/90 backdrop-blur-sm border-gray-700">
      <CardHeader>
        <CardTitle className="text-2xl text-white flex items-center justify-center gap-2">
          <Hand className="w-6 h-6 text-amber-400" />
          Rock Paper Scissors
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Score */}
        <div className="flex justify-center gap-6">
          <div className="text-center">
            <p className="text-gray-400 text-sm">Score</p>
            <p className="text-2xl font-bold text-white">{score}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm">W-L-D</p>
            <p className="text-xl font-bold text-white">{wins}-{losses}-{draws}</p>
          </div>
        </div>

        {/* Game Area */}
        <div className="space-y-6">
          {/* Battle Display */}
          {isPlaying && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-4"
            >
              <div className="flex justify-center items-center gap-8">
                <div className="text-center">
                  <p className="text-gray-400 mb-2">You</p>
                  <div className="text-6xl">
                    {choices.find(c => c.id === playerChoice)?.emoji}
                  </div>
                  <p className="text-white mt-2">{choices.find(c => c.id === playerChoice)?.name}</p>
                </div>
                
                <div className="text-2xl text-gray-400">VS</div>
                
                <div className="text-center">
                  <p className="text-gray-400 mb-2">Computer</p>
                  <div className="text-6xl">
                    {choices.find(c => c.id === computerChoice)?.emoji}
                  </div>
                  <p className="text-white mt-2">{choices.find(c => c.id === computerChoice)?.name}</p>
                </div>
              </div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`text-xl font-bold ${getResultColor()}`}
              >
                {getResultMessage()}
              </motion.div>

              <Button onClick={resetRound} className="bg-amber-500 hover:bg-amber-600">
                <RotateCcw className="w-4 h-4 mr-2" />
                Play Again
              </Button>
            </motion.div>
          )}

          {/* Choice Buttons */}
          {!isPlaying && (
            <div className="space-y-4">
              <p className="text-center text-gray-300">Choose your move:</p>
              <div className="flex justify-center gap-4">
                {choices.map((choice) => (
                  <motion.button
                    key={choice.id}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => playGame(choice.id)}
                    className="bg-gray-700 hover:bg-gray-600 rounded-lg p-6 transition-all hover:shadow-lg hover:shadow-amber-500/20"
                  >
                    <div className="text-5xl mb-2">{choice.emoji}</div>
                    <p className="text-white font-semibold">{choice.name}</p>
                  </motion.button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Reset Game */}
        {(wins > 0 || losses > 0 || draws > 0) && !isPlaying && (
          <div className="text-center">
            <Button onClick={resetGame} variant="outline" className="bg-gray-700 border-gray-600 text-white">
              Reset Stats
            </Button>
          </div>
        )}

        {/* Instructions */}
        <div className="text-center text-sm text-gray-400 space-y-1">
          <p>✊ Rock beats ✌️ Scissors</p>
          <p>✌️ Scissors beats ✋ Paper</p>
          <p>✋ Paper beats ✊ Rock</p>
          <p>🏆 Win: +5 points | Draw: 0 points</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default RockPaperScissors