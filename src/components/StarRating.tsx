import { useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  count?: number
  initialRating?: number
  onRatingChange: (rating: number) => void
}

export const StarRating = ({ count = 5, initialRating = 0, onRatingChange }: StarRatingProps) => {
  const [rating, setRating] = useState(initialRating)
  const [hoverRating, setHoverRating] = useState(0)

  const handleRating = (newRating: number) => {
    setRating(newRating)
    onRatingChange(newRating)
  }

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: count }, (_, index) => index).map((_, index) => {
        const starValue: number = index + 1
        return (
          <Star
            key={index}
            className={cn(
              'h-6 w-6 cursor-pointer transition-colors duration-200',
              starValue <= (hoverRating || rating)
                ? 'text-secondary fill-secondary'
                : 'text-border',
            )}
            onClick={() => handleRating(starValue)}
            onMouseEnter={() => setHoverRating(starValue)}
            onMouseLeave={() => setHoverRating(0)}
          />
        )
      })}
    </div>
  )
}
