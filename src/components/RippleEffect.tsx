import { motion } from 'framer-motion'

interface RippleEffectProps {
  x: number
  y: number
  onComplete: () => void
}

export default function RippleEffect({ x, y, onComplete }: RippleEffectProps) {
  return (
    <motion.span
      className="pointer-events-none fixed z-40 rounded-full border-2 border-yellow-400/60"
      style={{ left: x, top: y, width: 20, height: 20, translateX: '-50%', translateY: '-50%' }}
      initial={{ scale: 1, opacity: 0.7 }}
      animate={{ scale: 8, opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      onAnimationComplete={onComplete}
    />
  )
}
