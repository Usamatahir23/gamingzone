import { useState } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Zap } from 'lucide-react'

interface WordScrambleProps {
  onComplete: (score: number) => void
  playerName: string
  playerId: string
}

const WordScramble: React.FC<WordScrambleProps> = ({ onComplete }) => {
  const [score, setScore] = useState(0)

  const handleComplete = () => {
    const finalScore = score + 12
    setScore(finalScore)
    onComplete(finalScore)
  }

  return (
    <Card className="bg-gray-800/90 backdrop-blur-sm border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Zap className="w-6 h-6 text-green-400" />
          Word Scramble
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center space-y-4">
          <p className="text-gray-300">Word game coming soon!</p>
          <Button onClick={handleComplete} className="bg-green-500 hover:bg-green-600">
            Test Complete (+12 pts)
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default WordScramble