import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Grid3x3, RotateCcw } from 'lucide-react'

interface TicTacToeProps {
  onComplete: (score: number) => void
  playerName: string
  playerId: string
}

const TicTacToe: React.FC<TicTacToeProps> = ({ onComplete }) => {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null))
  const [isXNext, setIsXNext] = useState(true)
  const [winner, setWinner] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [gamesPlayed, setGamesPlayed] = useState(0)

  const calculateWinner = (squares: (string | null)[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6] // Diagonals
    ]

    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a]
      }
    }
    return null
  }

  const makeAIMove = (currentBoard: (string | null)[]) => {
    const availableSpots = currentBoard
      .map((spot, index) => spot === null ? index : null)
      .filter(val => val !== null) as number[]

    if (availableSpots.length === 0) return null

    // Simple AI: Random move with some strategy
    const randomSpot = availableSpots[Math.floor(Math.random() * availableSpots.length)]
    return randomSpot
  }

  const handleClick = (index: number) => {
    if (board[index] || winner || !isXNext) return

    const newBoard = [...board]
    newBoard[index] = 'X'
    setBoard(newBoard)
    setIsXNext(false)

    const gameWinner = calculateWinner(newBoard)
    if (gameWinner) {
      setWinner(gameWinner)
      const points = gameWinner === 'X' ? 10 : 0
      setScore(score + points)
      setGamesPlayed(gamesPlayed + 1)
      onComplete(score + points)
      return
    }

    // AI move
    setTimeout(() => {
      const aiMove = makeAIMove(newBoard)
      if (aiMove !== null) {
        const finalBoard = [...newBoard]
        finalBoard[aiMove] = 'O'
        setBoard(finalBoard)
        setIsXNext(true)

        const finalWinner = calculateWinner(finalBoard)
        if (finalWinner) {
          setWinner(finalWinner)
          const points = finalWinner === 'X' ? 10 : 0
          setScore(score + points)
          setGamesPlayed(gamesPlayed + 1)
          onComplete(score + points)
        } else if (finalBoard.every(square => square !== null)) {
          setWinner('Draw')
          setGamesPlayed(gamesPlayed + 1)
          onComplete(score + 5) // Draw gives 5 points
        }
      }
    }, 500)
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setIsXNext(true)
    setWinner(null)
  }

  const getStatus = () => {
    if (winner) {
      if (winner === 'Draw') return "It's a Draw!"
      return winner === 'X' ? 'You Win! 🎉' : 'AI Wins! 🤖'
    }
    return isXNext ? 'Your turn (X)' : 'AI thinking...'
  }

  const getStatusColor = () => {
    if (winner === 'X') return 'text-green-400'
    if (winner === 'O') return 'text-red-400'
    if (winner === 'Draw') return 'text-yellow-400'
    return 'text-gray-300'
  }

  return (
    <Card className="bg-gray-800/90 backdrop-blur-sm border-gray-700">
      <CardHeader>
        <CardTitle className="text-2xl text-white flex items-center justify-center gap-2">
          <Grid3x3 className="w-6 h-6 text-indigo-400" />
          Tic Tac Toe
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Score */}
        <div className="flex justify-center gap-8">
          <div className="text-center">
            <p className="text-gray-400 text-sm">Score</p>
            <p className="text-2xl font-bold text-white">{score}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm">Games</p>
            <p className="text-2xl font-bold text-white">{gamesPlayed}</p>
          </div>
        </div>

        {/* Status */}
        <div className="text-center">
          <p className={`text-xl font-semibold ${getStatusColor()}`}>
            {getStatus()}
          </p>
        </div>

        {/* Game Board */}
        <div className="flex justify-center">
          <div className="grid grid-cols-3 gap-2 bg-gray-900/50 p-4 rounded-lg border border-gray-700">
            {board.map((square, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: square ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleClick(index)}
                disabled={square !== null || winner !== null || !isXNext}
                className={`
                  w-20 h-20 rounded-lg font-bold text-3xl transition-all
                  ${square === 'X' ? 'bg-blue-500/20 text-blue-400 border-2 border-blue-500' : ''}
                  ${square === 'O' ? 'bg-red-500/20 text-red-400 border-2 border-red-500' : ''}
                  ${!square ? 'bg-gray-700 hover:bg-gray-600 border-2 border-gray-600' : ''}
                  ${!square && isXNext ? 'cursor-pointer hover:border-blue-400' : ''}
                  ${!square && !isXNext ? 'cursor-not-allowed' : ''}
                `}
              >
                {square}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <Button
            onClick={resetGame}
            className="bg-indigo-500 hover:bg-indigo-600"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            New Game
          </Button>
        </div>

        {/* Instructions */}
        <div className="text-center text-sm text-gray-400 space-y-1">
          <p>🎯 You are X, AI is O</p>
          <p>🏆 Win: +10 points | Draw: +5 points</p>
          <p>🤖 Try to beat the AI!</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default TicTacToe