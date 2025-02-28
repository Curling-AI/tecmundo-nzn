import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface FeatureCardProps {
  title: string
  description: string
  index: number
  variant?: 'left' | 'right'
  icon?: LucideIcon
}

export function FeatureCard({
  title,
  description,
  index,
  variant = 'left',
  icon: Icon,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: variant === 'left' ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="rounded-lg bg-white/5 p-3 text-left sm:p-4"
    >
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="mt-0.5 flex-shrink-0 text-white">
            <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
        )}
        <div>
          <h3 className="mb-1 text-base font-semibold sm:mb-2 sm:text-lg">{title}</h3>
          <p className="text-sm text-white/70 sm:text-base">{description}</p>
        </div>
      </div>
    </motion.div>
  )
}
