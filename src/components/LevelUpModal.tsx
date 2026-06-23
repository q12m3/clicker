import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { notifyHaptic } from '../lib/telegram'

const LEVEL_AVATARS = ['🐣','🐣','🐤','🐤','🦊','🦊','🦁','🦁','🔱','👑']
const LEVEL_TITLES  = [
  'Newcomer','Newcomer','Tapper','Tapper','Hustler',
  'Hustler','Whale','Whale','Legend','Legend',
]

interface LevelUpModalProps {
  level: number | null
  onClose: () => void
}

export default function LevelUpModal({ level, onClose }: LevelUpModalProps) {
  const avatar = level ? (LEVEL_AVATARS[level - 1] ?? '👑') : ''
  const title  = level ? (LEVEL_TITLES[level - 1]  ?? 'Legend') : ''

  useEffect(() => {
    if (level) notifyHaptic('success')
  }, [level])

  return (
    <AnimatePresence>
      {level && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-6 pointer-events-none"
            initial={{ opacity: 0, scale: 0.7, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            <div
              className="w-full max-w-xs rounded-3xl p-7 flex flex-col items-center gap-4 text-center pointer-events-auto"
              style={{
                background: 'linear-gradient(145deg, #2d0a5e, #0d0621)',
                border: '1px solid rgba(250,204,21,0.35)',
                boxShadow: '0 0 80px rgba(250,204,21,0.15), 0 0 160px rgba(168,85,247,0.1)',
              }}
            >
              {/* Confetti-like sparks */}
              {[...Array(6)].map((_, i) => (
                <motion.span
                  key={i}
                  className="absolute text-lg pointer-events-none"
                  initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale:   [0, 1.4, 0],
                    x: Math.cos((i / 6) * Math.PI * 2) * 90,
                    y: Math.sin((i / 6) * Math.PI * 2) * 90,
                  }}
                  transition={{ duration: 0.8, delay: 0.2 + i * 0.06 }}
                >
                  {['⭐','✨','🌟','💫','⚡','🎉'][i]}
                </motion.span>
              ))}

              <motion.div
                className="text-7xl"
                animate={{ rotate: [0, -15, 15, -10, 10, 0], scale: [1, 1.15, 1] }}
                transition={{ duration: 0.7, delay: 0.15 }}
              >
                {avatar}
              </motion.div>

              <div className="flex flex-col gap-1">
                <p className="text-yellow-400/70 text-xs font-bold uppercase tracking-widest">
                  Level up!
                </p>
                <h2 className="text-white font-black text-3xl">Level {level}</h2>
                <p className="text-purple-300 text-sm">{title}</p>
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="w-full py-3 rounded-2xl font-black text-black text-base mt-1"
                style={{ background: 'linear-gradient(90deg, #facc15, #f97316)' }}
              >
                Let's go! 🚀
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
