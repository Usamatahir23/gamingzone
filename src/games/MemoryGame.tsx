import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Clock, Trophy, RotateCcw } from 'lucide-react'

interface Card {
  id: number
  emoji: string
  isFlipped: boolean
  isMatched: boolean
}

interface Props {
  onComplete: (score: number) => void
}

const EMOJI_SETS = {
  easy: ['🎈', '🎨', '🎭', '🎪', '🎯', '🎲'],
  medium: ['🌟', '🌈', '🌺', '🌸', '🌼', '🌻', '🌷', '🌹'],
  hard: ['🦋', '🦜', '🦚', '🦩', '🦅', '🦆', '🦢', '🦉', '🦃', '🦚']
}

export default function MemoryGame({ onComplete }: Props) {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy')
  const [cards, setCards] = useState<Card[]>([])
  const [selectedCards, setSelectedCards] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [matches, setMatches] = useState(0)
  const [time, setTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const initializeGame = useCallback(() => {
    const emojis = EMOJI_SETS[difficulty]
    const gameCards: Card[] = []
    
    emojis.forEach((emoji, index) => {
      gameCards.push(
        { id: index * 2, emoji, isFlipped: false, isMatched: false },
        { id: index * 2 + 1, emoji, isFlipped: false, isMatched: false }
      )
    })
    
    const shuffled = gameCards.sort(() => Math.random() - 0.5)
    setCards(shuffled)
    setSelectedCards([])
    setMoves(0)
    setMatches(0)
    setTime(0)
    setIsPlaying(true)
  }, [difficulty])

  useEffect(() => {
    initializeGame()
  }, [initializeGame])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying && matches < cards.length / 2) {
      interval = setInterval(() => {
        setTime(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, matches, cards])

  useEffect(() => {
    if (selectedCards.length === 2) {
      const [first, second] = selectedCards
      const firstCard = cards.find(c => c.id === first)
      const secondCard = cards.find(c => c.id === second)
      
      if (firstCard && secondCard && firstCard.emoji === secondCard.emoji) {
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === first || card.id === second 
              ? { ...card, isMatched: true }
              : card
          ))
          setMatches(prev => prev + 1)
          setSelectedCards([])
        }, 600)
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === first || card.id === second 
              ? { ...card, isFlipped: false }
              : card
          ))
          setSelectedCards([])
        }, 1000)
      }
    }
  }, [selectedCards, cards])

  useEffect(() => {
    if (matches > 0 && matches === cards.length / 2) {
      setIsPlaying(false)
      const score = Math.max(1000 - moves * 10 - time * 2, 100)
      onComplete(score)
    }
  }, [matches, cards, moves, time, onComplete])

  const handleCardClick = (id: number) => {
    if (selectedCards.length >= 2) return
    if (cards.find(c => c.id === id)?.isMatched) return
    if (selectedCards.includes(id)) return
    
    setCards(prev => prev.map(card => 
      card.id === id ? { ...card, isFlipped: true } : card
    ))
    setSelectedCards(prev => [...prev, id])
    setMoves(prev => prev + 1)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getGridCols = () => {
    switch (difficulty) {
      case 'easy': return 'grid-cols-4'
      case 'medium': return 'grid-cols-4'
      case 'hard': return 'grid-cols-5'
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span>Memory Match</span>
            <div className="flex gap-2">
              <Select value={difficulty} onValueChange={(value: 'easy' | 'medium' | 'hard') => setDifficulty(value)}>
                <SelectTrigger className="w-32 bg-white/10 border-white/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={initializeGame} className="bg-purple-600 hover:bg-purple-700">
                <RotateCcw className="w-4 h-4 mr-2" />
                New Game
              </Button>
            </div>
          </CardTitle>
          <div className="flex gap-6 text-white">
            <div>Moves: {moves}</div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {formatTime(time)}
            </div>
            <div>Matches: {matches}/{cards.length / 2}</div>
          </div>
        </CardHeader>
        <CardContent>
          <div className={`grid ${getGridCols()} gap-3`}>
            <AnimatePresence>
              {cards.map((card) => (
                <motion.div
                  key={card.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.button
                    onClick={() => handleCardClick(card.id)}
                    className={`w-full aspect-square rounded-xl text-4xl font-bold transition-all ${
                      card.isFlipped || card.isMatched
                        ? card.isMatched
                          ? 'bg-green-500 text-white'
                          : 'bg-purple-500 text-white'
                        : 'bg-white/20 border-2 border-white/30 hover:border-white/50'
                    }`}
                    animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      {card.isFlipped || card.isMatched ? (
                        <span style={{ transform: 'rotateY(180deg)', display: 'inline-block' }}>
                          {card.emoji}
                        </span>
                      ) : (
                        <span className="text-white/50">?</span>
                      )}
                    </div>
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}