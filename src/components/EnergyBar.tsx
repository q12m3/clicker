import { motion } from 'framer-motion'

interface EnergyBarProps {
  energy: number
  maxEnergy: number
  regenRate: number
}

export default function EnergyBar({ energy, maxEnergy, regenRate }: EnergyBarProps) {
  const pct = energy / maxEnergy

  const barColor =
    pct > 0.6 ? '#facc15'  // yellow
    : pct > 0.3 ? '#f97316' // orange
    : '#ef4444'             // red

  return (
    <div className="w-full max-w-xs flex flex-col gap-1.5">
      {/* Label row */}
      <div className="flex items-center justify-between text-xs px-0.5">
        <div className="flex items-center gap-1 text-white/60">
          <span>⚡</span>
          <span>Energy</span>
        </div>
        <div className="flex items-center gap-1 text-white/50">
          <span className="font-semibold" style={{ color: barColor }}>
            {Math.floor(energy)}
          </span>
          <span>/ {maxEnergy}</span>
          <span className="text-white/30 ml-1">+{regenRate}/s</span>
        </div>
      </div>

      {/* Track */}
      <div className="relative h-2.5 w-full rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${barColor}99, ${barColor})` }}
          animate={{ width: `${pct * 100}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
        {/* Sheen */}
        <div className="absolute inset-0 rounded-full"
          style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 60%)' }}
        />
      </div>
    </div>
  )
}
