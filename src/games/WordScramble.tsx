import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Zap, RotateCcw, CheckCircle, XCircle, Trophy } from 'lucide-react'

interface WordScrambleProps {
  onComplete: (score: number) => void
  playerName: string
  playerId: string
}

const WORDS = [
  'REACT', 'TYPESCRIPT', 'JAVASCRIPT', 'VITE', 'TAILWIND', 'GITHUB', 'DEPLOY', 'BUILD',
  'CODING', 'DEVELOPER', 'PROGRAMMING', 'SOFTWARE', 'WEBSITE', 'APPLICATION', 'INTERFACE',
  'COMPONENT', 'FRAMEWORK', 'LIBRARY', 'FUNCTION', 'VARIABLE', 'CONSOLE', 'DEBUG',
  'ANIMATION', 'RESPONSIVE', 'BROWSER', 'SERVER', 'DATABASE', 'API', 'JSON'
]

const shuffleWord = (word: string): string => {
  const letters = word.split('')
  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[letters[i], letters[j]] = [letters[j], letters[i]]
  }
  return letters.join('')
}

const WordScramble: React.FC<WordScrambleProps> = ({ onComplete }) => {
  const [currentWord, setCurrentWord] = useState('')
  const [scrambledWord, setScrambledWord] = useState('')
  const [guess, setGuess] = useState('')
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [isPlaying, setIsPlaying] = useState(false)
  const [correct, setCorrect] = useState(0)
  const [wrong, setWrong] = useState(0)
  const [hint, setHint] = useState('')

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && isPlaying) {
      setIsPlaying(false)
      onComplete(score)
    }
  }, [timeLeft, isPlaying, score, onComplete])

  const startGame = () => {
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)]
    setCurrentWord(randomWord)
    setScrambledWord(shuffleWord(randomWord))
    setGuess('')
    setScore(0)
    setTimeLeft(60)
    setCorrect(0)
    setWrong(0)
    setHint('')
    setIsPlaying(true)
  }

  const checkAnswer = () => {
    if (!isPlaying) return

    if (guess.toUpperCase().trim() === currentWord.toUpperCase()) {
      const points = currentWord.length * 10
      setScore(score + points)
      setCorrect(correct + 1)
      setGuess('')
      nextWord()
    } else {
      setWrong(wrong + 1)
      setGuess('')
    }
  }

  const nextWord = () => {
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)]
    setCurrentWord(randomWord)
    setScrambledWord(shuffleWord(randomWord))
    setGuess('')
    setHint('')
  }

  const getHint = () => {
    if (currentWord && !hint) {
      const firstLetter = currentWord[0]
      setHint(`Starts with: ${firstLetter}`)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && isPlaying) {
      checkAnswer()
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-green-400" />
              Word Scramble
            </span>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-gray-400 text-sm">Time</p>
                <p className={`text-2xl font-bold ${timeLeft < 10 ? 'text-red-400' : 'text-white'}`}>
                  {timeLeft}s
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-sm">Score</p>
                <p className="text-2xl font-bold text-green-400">{score}</p>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isPlaying ? (
            <div className="text-center space-y-4 py-8">
              <Trophy className="w-16 h-16 mx-auto text-yellow-400" />
              <h3 className="text-2xl font-bold text-white">Unscramble the Words!</h3>
              <p className="text-gray-300">You have 60 seconds to unscramble as many words as possible.</p>
              <Button 
                onClick={startGame} 
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-6 text-lg"
              >
                Start Game
              </Button>
              {score > 0 && (
                <div className="mt-6 p-4 bg-gray-900/50 rounded-lg">
                  <p className="text-white font-semibold text-lg">Final Score: {score}</p>
                  <p className="text-gray-300">Correct: {correct} | Wrong: {wrong}</p>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="text-center space-y-4">
                <div className="p-6 bg-black/30 rounded-lg border-2 border-white/20">
                  <p className="text-gray-400 text-sm mb-2">Scrambled Word:</p>
                  <motion.div
                    key={scrambledWord}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-4xl font-bold text-white tracking-widest"
                  >
                    {scrambledWord}
                  </motion.div>
                </div>

                {hint && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-blue-500/20 border border-blue-500/50 rounded-lg"
                  >
                    <p className="text-blue-300 text-sm">{hint}</p>
                  </motion.div>
                )}

                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={guess}
                    onChange={(e) => setGuess(e.target.value.toUpperCase())}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter your guess..."
                    className="bg-white/10 border-white/20 text-white text-center text-xl placeholder-gray-500"
                    autoFocus
                  />
                  <Button
                    onClick={checkAnswer}
                    className="bg-green-500 hover:bg-green-600 px-6"
                  >
                    <CheckCircle className="w-5 h-5" />
                  </Button>
                </div>

                <div className="flex justify-center gap-4">
                  <Button
                    onClick={getHint}
                    variant="outline"
                    className="border-blue-500/50 bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 hover:text-blue-200"
                    disabled={!!hint}
                  >
                    Get Hint
                  </Button>
                  <Button
                    onClick={nextWord}
                    variant="outline"
                    className="border-yellow-500/50 bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30 hover:text-yellow-200"
                  >
                    Skip Word
                  </Button>
                  <Button
                    onClick={() => {
                      setIsPlaying(false)
                      onComplete(score)
                    }}
                    variant="outline"
                    className="border-red-500/50 bg-red-500/20 text-red-300 hover:bg-red-500/30 hover:text-red-200"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    End Game
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-3 text-center">
                  <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-1" />
                  <p className="text-green-400 font-semibold">Correct: {correct}</p>
                </div>
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-center">
                  <XCircle className="w-6 h-6 text-red-400 mx-auto mb-1" />
                  <p className="text-red-400 font-semibold">Wrong: {wrong}</p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default WordScramble
