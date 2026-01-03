import { useState } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Clock } from 'lucide-react'

interface ReactionTimeProps {
  onComplete: (score: number) => void
  playerName: string
  playerId: string
}

const ReactionTime: React.FC<ReactionTimeProps> = ({ onComplete }) => {
  const [score, setScore] = useState(0)

  const handleComplete = () => {
    const finalScore = score + 18
    setScore(finalScore)
    onComplete(finalScore)
  }

  return (
    <Card className="bg-gray-800/90 backdrop-blur-sm border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Clock className="w-6 h-6 text-purple-400" />
          Reaction Time
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center space-y-4">
          <p className="text-gray-300">Reaction game coming soon!</p>
          <Button onClick={handleComplete} className="bg-purple-500 hover:bg-purple-600">
            Test Complete (+18 pts)
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default ReactionTime