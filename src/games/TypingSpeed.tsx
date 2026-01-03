import { useState, useEffect, useRef } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Textarea } from '../components/ui/textarea'
import { Keyboard, Timer, Zap } from 'lucide-react'

interface TypingSpeedProps {
  onComplete: (score: number) => void
  playerName: string
  playerId: string
}

const sampleTexts = [
  "The quick brown fox jumps over the lazy dog. This pangram sentence contains every letter of the alphabet at least once.",
  "Technology has revolutionized the way we communicate, work, and live our daily lives in the modern world.",
  "Practice makes perfect when learning to type faster and more accurately on the keyboard.",
  "Coding is like writing a book, except you have to be extremely precise with every character.",
  "The journey of a thousand miles begins with a single step in the right direction."
]

const TypingSpeed: React.FC<TypingSpeedProps> = ({ onComplete }) => {
  const [sampleText, setSampleText] = useState('')
  const [userInput, setUserInput] = useState('')
  const [timeLeft, setTimeLeft] = useState(60)
  const [isStarted, setIsStarted] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [score, setScore] = useState(0)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setSampleText(sampleTexts[Math.floor(Math.random() * sampleTexts.length)])
  }, [])

  useEffect(() => {
    if (isStarted && timeLeft > 0 && !isFinished) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && isStarted) {
      finishTest()
    }
  }, [timeLeft, isStarted, isFinished])

  const startTest = () => {
    setIsStarted(true)
    setUserInput('')
    setTimeLeft(60)
    setIsFinished(false)
    inputRef.current?.focus()
  }

  const finishTest = () => {
    setIsFinished(true)
    setIsStarted(false)
    
    // Calculate WPM
    const words = userInput.trim().split(/\s+/).length
    const minutes = 1 // 60 seconds = 1 minute
    const calculatedWPM = Math.round(words / minutes)
    setWpm(calculatedWPM)
    
    // Calculate accuracy
    const sampleWords = sampleText.split('')
    const userWords = userInput.split('')
    let correct = 0
    for (let i = 0; i < Math.min(sampleWords.length, userWords.length); i++) {
      if (sampleWords[i] === userWords[i]) correct++
    }
    const calculatedAccuracy = Math.round((correct / sampleWords.length) * 100)
    setAccuracy(calculatedAccuracy)
    
    // Calculate score
    const finalScore = Math.round((calculatedWPM * calculatedAccuracy) / 10)
    setScore(finalScore)
    onComplete(finalScore)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isStarted || isFinished) return
    setUserInput(e.target.value)
  }

  const getCharacterClass = (index: number) => {
    if (!isStarted) return 'text-gray-400'
    if (index >= userInput.length) return 'text-gray-500'
    return userInput[index] === sampleText[index] ? 'text-green-400' : 'text-red-400 bg-red-900/30'
  }

  return (
    <Card className="bg-gray-800/90 backdrop-blur-sm border-gray-700">
      <CardHeader>
        <CardTitle className="text-2xl text-white flex items-center justify-center gap-2">
          <Keyboard className="w-6 h-6 text-teal-400" />
          Typing Speed Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Timer and Stats */}
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <Timer className="w-5 h-5 text-yellow-400" />
            <span className="text-white font-bold">{timeLeft}s</span>
          </div>
          {isFinished && (
            <>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-400" />
                <span className="text-white font-bold">{wpm} WPM</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400 font-bold">{accuracy}%</span>
              </div>
            </>
          )}
        </div>

        {/* Sample Text */}
        <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
          <p className="text-lg leading-relaxed font-mono">
            {sampleText.split('').map((char, index) => (
              <span key={index} className={getCharacterClass(index)}>
                {char}
              </span>
            ))}
          </p>
        </div>

        {/* Input Area */}
        <div className="space-y-2">
          <Textarea
            ref={inputRef}
            value={userInput}
            onChange={handleInputChange}
            placeholder={isStarted ? "Start typing..." : "Click 'Start Test' to begin"}
            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 font-mono"
            rows={4}
            disabled={!isStarted || isFinished}
          />
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          {!isStarted && !isFinished && (
            <Button onClick={startTest} className="bg-teal-500 hover:bg-teal-600">
              Start Test
            </Button>
          )}
          {isStarted && (
            <Button onClick={finishTest} variant="outline" className="bg-gray-700 border-gray-600 text-white">
              Finish Early
            </Button>
          )}
          {isFinished && (
            <div className="space-y-4 text-center">
              <div className="space-y-2">
                <p className="text-2xl font-bold text-white">Score: {score}</p>
                <p className="text-gray-300">Speed: {wpm} WPM | Accuracy: {accuracy}%</p>
              </div>
              <Button onClick={startTest} className="bg-teal-500 hover:bg-teal-600">
                Try Again
              </Button>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="text-center text-sm text-gray-400 space-y-1">
          <p>⌨️ Type the text as fast and accurately as you can</p>
          <p>⏱️ You have 60 seconds to complete the test</p>
          <p>📊 Score = (WPM × Accuracy) ÷ 10</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default TypingSpeed