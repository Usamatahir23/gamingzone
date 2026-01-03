import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Textarea } from '../components/ui/textarea'
import { Clock, RotateCcw, Target } from 'lucide-react'

interface Props {
  onComplete: (score: number) => void
}

const SAMPLE_TEXTS = [
  "The quick brown fox jumps over the lazy dog. This pangram contains all letters of the alphabet.",
  "Technology has revolutionized the way we communicate, work, and live in the modern world.",
  "Practice makes perfect. The more you type, the faster and more accurate you become.",
  "In the depths of winter, I finally learned that there was in me an invincible summer."
]

export default function TypingTest({ onComplete }: Props) {
  const [text, setText] = useState(SAMPLE_TEXTS[0])
  const [userInput, setUserInput] = useState('')
  const [startTime, setStartTime] = useState<number | null>(null)
  const [endTime, setEndTime] = useState<number | null>(null)
  const [isStarted, setIsStarted] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (userInput.length === 1 && !startTime) {
      setStartTime(Date.now())
      setIsStarted(true)
    }

    if (userInput === text && !isCompleted) {
      setEndTime(Date.now())
      setIsCompleted(true)
      const timeTaken = (Date.now() - (startTime || Date.now())) / 1000
      const wordsTyped = text.split(' ').length
      const wpm = Math.round((wordsTyped / timeTaken) * 60)
      const accuracy = calculateAccuracy()
      const score = Math.round(wpm * accuracy)
      onComplete(score)
    }
  }, [userInput, text, startTime, isCompleted, onComplete])

  const calculateAccuracy = () => {
    let correct = 0
    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] === text[i]) correct++
    }
    return userInput.length > 0 ? (correct / userInput.length) * 100 : 100
  }

  const resetTest = () => {
    setText(SAMPLE_TEXTS[Math.floor(Math.random() * SAMPLE_TEXTS.length)])
    setUserInput('')
    setStartTime(null)
    setEndTime(null)
    setIsStarted(false)
    setIsCompleted(false)
    textareaRef.current?.focus()
  }

  const getTimeElapsed = () => {
    if (!startTime) return 0
    const end = endTime || Date.now()
    return Math.floor((end - startTime) / 1000)
  }

  const getWPM = () => {
    if (!startTime) return 0
    const timeElapsed = (endTime || Date.now() - startTime) / 1000 / 60
    const words = userInput.trim().split(' ').length
    return Math.round(words / timeElapsed) || 0
  }

  const getAccuracy = () => {
    return Math.round(calculateAccuracy())
  }

  const getCharacterClass = (index: number) => {
    if (index >= userInput.length) return 'text-white/50'
    return userInput[index] === text[index] 
      ? 'text-green-400' 
      : 'text-red-400 bg-red-900/30'
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Typing Speed Test
            </span>
            <Button onClick={resetTest} className="bg-purple-600 hover:bg-purple-700">
              <RotateCcw className="w-4 h-4 mr-2" />
              New Test
            </Button>
          </CardTitle>
          <div className="flex gap-6 text-white">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {getTimeElapsed()}s
            </div>
            <div>WPM: {getWPM()}</div>
            <div>Accuracy: {getAccuracy()}%</div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-black/30 rounded-lg">
            <p className="text-lg leading-relaxed font-mono">
              {text.split('').map((char, index) => (
                <span key={index} className={getCharacterClass(index)}>
                  {char}
                </span>
              ))}
            </p>
          </div>
          
          <Textarea
            ref={textareaRef}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Start typing here..."
            className="bg-white/10 border-white/20 text-white placeholder-white/50 resize-none h-32"
            disabled={isCompleted}
          />

          {isCompleted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-center"
            >
              <p className="text-green-400 font-bold text-lg">Test Completed!</p>
              <p className="text-white">
                Speed: {getWPM()} WPM | Accuracy: {getAccuracy()}% | Score: {Math.round(getWPM() * getAccuracy() / 100)}
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}