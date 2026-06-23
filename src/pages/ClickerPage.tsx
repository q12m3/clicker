import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import CoinButton from '../components/CoinButton'
import FloatingLabel from '../components/FloatingLabel'
import RippleEffect from '../components/RippleEffect'
import EnergyBar from '../components/EnergyBar'

interface TapEffect {
  id: number
  x: number
  y: number
}

export default function ClickerPage() {
  const coinsPerTap = useGameStore((s) => s.coinsPerTap)
  const energy      = useGameStore((s) => s.energy)
  const maxEnergy   = useGameStore((s) => s.maxEnergy)
  const regenRate   = useGameStore((s) => s.regenRate)
  const tap         = useGameStore((s) => s.tap)

  const [floats, setFloats]   = useState<TapEffect[]>([])
  const [ripples, setRipples] = useState<TapEffect[]>([])

  const disabled = energy < 1

  const handleTap = useCallback((x: number, y: number) => {
    if (disabled) return
    tap()
    const id = Date.now() + Math.random()
    setFloats((prev)  => [...prev, { id, x, y }])
    setRipples((prev) => [...prev, { id: id + 0.1, x, y }])
  }, [tap, disabled])

  const removeFloat  = useCallback((id: number) => setFloats((p)  => p.filter((f) => f.id !== id)), [])
  const removeRipple = useCallback((id: number) => setRipples((p) => p.filter((r) => r.id !== id)), [])

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6 pb-4">

      {/* Per-tap badge */}
      <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-4 py-1.5">
        <span className="text-yellow-400 text-sm">🪙</span>
        <span className="text-white/70 text-sm">
          <span className="text-yellow-400 font-bold">+{coinsPerTap}</span> per tap
        </span>
      </div>

      {/* Coin */}
      <CoinButton onTap={handleTap} disabled={disabled} />

      {/* Status hint */}
      {disabled ? (
        <motion.p
          className="text-red-400/80 text-sm tracking-wide font-semibold"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        >
          ⚡ Energy depleted — recharging...
        </motion.p>
      ) : (
        <motion.p
          className="text-white/30 text-sm tracking-wide"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          TAP TO EARN
        </motion.p>
      )}

      {/* Energy bar */}
      <EnergyBar energy={energy} maxEnergy={maxEnergy} regenRate={regenRate} />

      {floats.map((f) => (
        <FloatingLabel key={f.id} x={f.x} y={f.y} value={coinsPerTap} onComplete={() => removeFloat(f.id)} />
      ))}
      {ripples.map((r) => (
        <RippleEffect key={r.id} x={r.x} y={r.y} onComplete={() => removeRipple(r.id)} />
      ))}
    </div>
  )
}
