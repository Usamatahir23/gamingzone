import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Clock, RotateCcw, Trophy, Zap } from 'lucide-react'

interface ReactionTimeProps {
  onComplete: (score: number) => void
  playerName: string
  playerId: string
}

const ReactionTime: React.FC<ReactionTimeProps> = ({ onComplete }) => {
  const [state, setState] = useState<'waiting' | 'ready' | 'too-early' | 'finished'>('waiting')
  const [reactionTimes, setReactionTimes] = useState<number[]>([])
  const [currentReaction, setCurrentReaction] = useState<number | null>(null)
  const [round, setRound] = useState(0)
  const [averageTime, setAverageTime] = useState<number | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const readyTimeRef = useRef<number | null>(null)

  const MAX_ROUNDS = 5

  useEffect(() => {
    if (state === 'finished' && reactionTimes.length === MAX_ROUNDS) {
      const avg = reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length
      setAverageTime(avg)
      const finalScore = Math.max(10000 - Math.round(avg * 10), 0)
      onComplete(finalScore)
    }
  }, [state, reactionTimes, onComplete])

  const startRound = () => {
    setState('waiting')
    setCurrentReaction(null)
    
    // Random delay between 2-5 seconds before showing "ready"
    const delay = 2000 + Math.random() * 3000
    
    timeoutRef.current = setTimeout(() => {
      setState('ready')
      readyTimeRef.current = Date.now()
    }, delay)
  }

  const handleClick = () => {
    if (state === 'waiting') {
      // Clicked too early
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      setState('too-early')
      return
    }

    if (state === 'ready' && readyTimeRef.current) {
      const reactionTime = Date.now() - readyTimeRef.current
      setCurrentReaction(reactionTime)
      setReactionTimes([...reactionTimes, reactionTime])
      
      if (round + 1 < MAX_ROUNDS) {
        setRound(round + 1)
        setTimeout(() => {
          startRound()
        }, 1500)
      } else {
        setState('finished')
      }
    }
  }

  const resetGame = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setState('waiting')
    setReactionTimes([])
    setCurrentReaction(null)
    setRound(0)
    setAverageTime(null)
    startTimeRef.current = null
    readyTimeRef.current = null
  }

  const getButtonColor = () => {
    switch (state) {
      case 'waiting':
        return 'bg-red-500 hover:bg-red-600'
      case 'ready':
        return 'bg-green-500 hover:bg-green-600 animate-pulse'
      case 'too-early':
        return 'bg-yellow-500 hover:bg-yellow-600'
      case 'finished':
        return 'bg-gray-500 hover:bg-gray-600'
      default:
        return 'bg-gray-500 hover:bg-gray-600'
    }
  }

  const getButtonText = () => {
    switch (state) {
      case 'waiting':
        return 'Wait for Green...'
      case 'ready':
        return 'CLICK NOW!'
      case 'too-early':
        return 'Too Early! Click to Try Again'
      case 'finished':
        return 'Game Finished!'
      default:
        return 'Start'
    }
  }

  const getStatusColor = () => {
    if (currentReaction !== null) {
      if (currentReaction < 200) return 'text-green-400'
      if (currentReaction < 300) return 'text-yellow-400'
      return 'text-red-400'
    }
    return 'text-white'
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Clock className="w-6 h-6 text-purple-400" />
              Reaction Time Test
            </span>
            <div className="text-right">
              <p className="text-gray-400 text-sm">Round {round + 1} / {MAX_ROUNDS}</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {state === 'finished' ? (
            <div className="text-center space-y-6 py-8">
              <Trophy className="w-16 h-16 mx-auto text-yellow-400" />
              <h3 className="text-2xl font-bold text-white">Game Complete!</h3>
              
              {averageTime !== null && (
                <div className="space-y-4">
                  <div className="p-6 bg-gray-900/50 rounded-lg border-2 border-purple-500/50">
                    <p className="text-gray-400 text-sm mb-2">Average Reaction Time</p>
                    <p className={`text-5xl font-bold ${getStatusColor()}`}>
                      {averageTime.toFixed(0)}ms
                    </p>
                  </div>

                  <div className="grid grid-cols-5 gap-2">
                    {reactionTimes.map((time, index) => (
                      <div key={index} className="bg-gray-900/50 rounded-lg p-3">
                        <p className="text-gray-400 text-xs">Round {index + 1}</p>
                        <p className="text-white font-semibold">{time}ms</p>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-blue-500/20 border border-blue-500/50 rounded-lg">
                    <p className="text-blue-300 text-sm">
                      {averageTime < 200 ? 'Excellent! 🏆' : 
                       averageTime < 300 ? 'Good! 👍' : 
                       averageTime < 400 ? 'Average ⚡' : 
                       'Keep practicing! 💪'}
                    </p>
                  </div>
                </div>
              )}

              <Button
                onClick={resetGame}
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-8 py-6 text-lg"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Play Again
              </Button>
            </div>
          ) : (
            <div className="text-center space-y-6">
              <div className="space-y-4">
                <p className="text-gray-300 text-lg">
                  {state === 'waiting' && 'Wait for the button to turn GREEN, then click as fast as you can!'}
                  {state === 'ready' && 'NOW! Click as fast as you can!'}
                  {state === 'too-early' && 'Oops! You clicked too early. Wait for green next time!'}
                </p>

                <motion.div
                  initial={{ scale: 1 }}
                  animate={state === 'ready' ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="flex justify-center"
                >
                  <Button
                    onClick={handleClick}
                    className={`${getButtonColor()} text-white text-2xl font-bold px-12 py-12 rounded-full min-w-[300px] min-h-[300px] transition-all`}
                  >
                    {state === 'ready' && <Zap className="w-8 h-8 mr-2" />}
                    {getButtonText()}
                  </Button>
                </motion.div>

                {currentReaction !== null && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`p-6 bg-gray-900/50 rounded-lg border-2 ${getStatusColor()} border-current`}
                  >
                    <p className="text-sm mb-2">Your Reaction Time</p>
                    <p className={`text-4xl font-bold ${getStatusColor()}`}>
                      {currentReaction}ms
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                      {currentReaction < 200 ? 'Lightning fast! ⚡' : 
                       currentReaction < 300 ? 'Very good! 👍' : 
                       currentReaction < 400 ? 'Good! 💪' : 
                       'You can do better! 🎯'}
                    </p>
                  </motion.div>
                )}

                {reactionTimes.length > 0 && (
                  <div className="bg-gray-900/30 rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-2">Previous Times:</p>
                    <div className="flex gap-2 justify-center flex-wrap">
                      {reactionTimes.map((time, index) => (
                        <span key={index} className="bg-gray-800 px-3 py-1 rounded text-white text-sm">
                          {time}ms
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {state === 'waiting' && round === 0 && (
                  <Button
                    onClick={startRound}
                    className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-8 py-6 text-lg"
                  >
                    Start Test
                  </Button>
                )}

                {(state === 'too-early' || (state === 'waiting' && round > 0)) && (
                  <Button
                    onClick={startRound}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    {state === 'too-early' ? 'Try Again' : 'Continue'}
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ReactionTime
