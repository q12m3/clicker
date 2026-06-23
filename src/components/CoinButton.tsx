import { motion, useAnimation } from 'framer-motion'
import { haptic } from '../lib/telegram'

interface CoinButtonProps {
  onTap: (x: number, y: number) => void
  disabled?: boolean
}

const tapShake = {
  rotate: [0, -8, 8, -5, 5, -2, 2, 0],
  scale:  [1, 0.91, 0.95, 0.93, 0.96, 0.98, 0.99, 1],
}

const noEnergyShake = {
  x:     [0, -10, 10, -8, 8, -4, 4, 0],
  scale: [1, 0.97, 0.97, 0.97, 0.97, 0.97, 0.97, 1],
}

export default function CoinButton({ onTap, disabled = false }: CoinButtonProps) {
  const controls = useAnimation()

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) {
      haptic('heavy')
      controls.start({ ...noEnergyShake, transition: { duration: 0.4, ease: 'easeOut' } })
      return
    }
    haptic('medium')
    onTap(e.clientX, e.clientY)
    controls.start({ ...tapShake, transition: { duration: 0.45, ease: 'easeOut' } })
  }

  return (
    <motion.button
      animate={controls}
      onClick={handleClick}
      className="relative w-52 h-52 rounded-full focus:outline-none cursor-pointer select-none transition-opacity duration-300"
      style={{
        WebkitTapHighlightColor: 'transparent',
        opacity: disabled ? 0.45 : 1,
        filter:  disabled ? 'grayscale(60%)' : 'none',
      }}
    >
      {!disabled && (
        <span className="absolute inset-0 rounded-full bg-yellow-400/20 blur-xl" />
      )}

      <motion.span
        className="absolute inset-0 rounded-full border-2 border-yellow-400/40"
        animate={disabled ? {} : { scale: [1, 1.06, 1], opacity: [0.4, 0.1, 0.4] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      />

      <span
        className="absolute inset-2 rounded-full flex items-center justify-center"
        style={{
          background: 'radial-gradient(circle at 35% 35%, #ffe566, #f5a623 55%, #c67c0d 100%)',
          boxShadow: disabled
            ? 'none'
            : '0 8px 32px rgba(245,166,35,0.5), inset 0 -6px 12px rgba(0,0,0,0.25), inset 0 4px 8px rgba(255,255,255,0.3)',
        }}
      >
        <span
          className="w-28 h-28 rounded-full flex items-center justify-center"
          style={{
            background: 'radial-gradient(circle at 40% 40%, #ffe066, #e8930a 80%)',
            boxShadow: 'inset 0 3px 6px rgba(0,0,0,0.2), inset 0 -2px 4px rgba(255,255,255,0.2)',
          }}
        >
          <span className="text-5xl select-none" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>
            {disabled ? '😴' : '💰'}
          </span>
        </span>
      </span>
    </motion.button>
  )
}
