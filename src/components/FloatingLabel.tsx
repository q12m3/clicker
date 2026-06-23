import { motion } from 'framer-motion'

interface FloatingLabelProps {
  x: number
  y: number
  value: number
  onComplete: () => void
}

export default function FloatingLabel({ x, y, value, onComplete }: FloatingLabelProps) {
  return (
    <motion.div
      className="pointer-events-none fixed z-50 select-none font-black text-yellow-400 text-2xl"
      style={{ left: x, top: y, translateX: '-50%', translateY: '-50%' }}
      initial={{ opacity: 1, y: 0, scale: 1 }}
      animate={{ opacity: 0, y: -90, scale: 1.3 }}
      transition={{ duration: 0.85, ease: 'easeOut' }}
      onAnimationComplete={onComplete}
    >
      +{value}
    </motion.div>
  )
}
