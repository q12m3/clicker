import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { notifyHaptic } from '../lib/telegram'

interface OfflineEarnings {
  coins:   number
  energy:  number
  seconds: number
}

interface OfflineEarningsModalProps {
  earnings: OfflineEarnings | null
  onCollect: () => void
}

function formatDuration(seconds: number): string {
  if (seconds < 60)   return `${seconds}s`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  return `${h}h ${m}m`
}

export default function OfflineEarningsModal({ earnings, onCollect }: OfflineEarningsModalProps) {
  useEffect(() => {
    if (earnings) notifyHaptic('success')
  }, [earnings])

  return (
    <AnimatePresence>
      {earnings && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-6"
            initial={{ opacity: 0, scale: 0.85, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          >
            <div
              className="w-full max-w-sm rounded-2xl p-6 flex flex-col items-center gap-5 text-center"
              style={{
                background: 'linear-gradient(145deg, #1e0a3c, #0d0621)',
                border: '1px solid rgba(250,204,21,0.25)',
                boxShadow: '0 0 60px rgba(250,204,21,0.1)',
              }}
            >
              {/* Icon */}
              <motion.span
                className="text-6xl"
                animate={{ rotate: [0, -10, 10, -8, 8, 0] }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                🎉
              </motion.span>

              <div className="flex flex-col gap-1">
                <h2 className="text-white font-bold text-xl">Welcome back!</h2>
                <p className="text-white/50 text-sm">
                  You were away for <span className="text-white/80">{formatDuration(earnings.seconds)}</span>
                </p>
              </div>

              {/* Earnings breakdown */}
              <div className="w-full flex flex-col gap-2">
                {earnings.coins > 0 && (
                  <div className="flex items-center justify-between bg-yellow-400/10 border border-yellow-400/20 rounded-xl px-4 py-2.5">
                    <span className="text-white/70 text-sm flex items-center gap-1.5">
                      🪙 Passive income
                    </span>
                    <span className="text-yellow-400 font-bold">+{earnings.coins.toLocaleString()}</span>
                  </div>
                )}
                {earnings.energy > 0 && (
                  <div className="flex items-center justify-between bg-blue-400/10 border border-blue-400/20 rounded-xl px-4 py-2.5">
                    <span className="text-white/70 text-sm flex items-center gap-1.5">
                      ⚡ Energy recovered
                    </span>
                    <span className="text-blue-300 font-bold">+{Math.floor(earnings.energy)}</span>
                  </div>
                )}
              </div>

              <motion.button
                onClick={onCollect}
                whileTap={{ scale: 0.95 }}
                className="w-full py-3 rounded-xl font-bold text-black text-base"
                style={{ background: 'linear-gradient(90deg, #facc15, #f97316)' }}
              >
                Collect
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
