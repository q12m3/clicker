import { motion } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { UPGRADES, getUpgradeCost } from '../config/upgrades'

export default function ShopPage() {
  const coins             = useGameStore((s) => s.coins)
  const upgradesPurchased = useGameStore((s) => s.upgradesPurchased)
  const passiveIncome     = useGameStore((s) => s.passiveIncome)
  const coinsPerTap       = useGameStore((s) => s.coinsPerTap)
  const buyUpgrade        = useGameStore((s) => s.buyUpgrade)

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between">
        <h2 className="text-white font-bold text-lg">Upgrades</h2>
        <div className="flex gap-3 text-xs text-white/50">
          <span>⚡ <span className="text-white/70">{coinsPerTap}/tap</span></span>
          <span>🌾 <span className="text-white/70">{passiveIncome}/s</span></span>
        </div>
      </div>

      {/* Upgrade list */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-3"
        style={{ scrollbarWidth: 'none' }}
      >
        {UPGRADES.map((upgrade, i) => {
          const level     = upgradesPurchased[upgrade.id] ?? 0
          const cost      = getUpgradeCost(upgrade, level)
          const canAfford = coins >= cost
          const isTap     = upgrade.effect === 'coinsPerTap'

          return (
            <motion.div
              key={upgrade.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.3 }}
              className="relative rounded-2xl overflow-hidden flex items-center gap-3 p-3"
              style={{
                background: canAfford
                  ? 'linear-gradient(135deg, rgba(250,204,21,0.08), rgba(249,115,22,0.05))'
                  : 'rgba(255,255,255,0.04)',
                border: canAfford
                  ? '1px solid rgba(250,204,21,0.2)'
                  : '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {/* Icon */}
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl shrink-0"
                style={{
                  background: canAfford
                    ? 'linear-gradient(135deg, rgba(250,204,21,0.15), rgba(249,115,22,0.1))'
                    : 'rgba(255,255,255,0.05)',
                }}
              >
                {upgrade.icon}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-white font-semibold text-sm">{upgrade.name}</span>
                  {level > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-yellow-400/20 text-yellow-400">
                      Lv {level}
                    </span>
                  )}
                </div>
                <p className="text-white/40 text-xs mt-0.5 truncate">{upgrade.description}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className={`text-xs font-bold ${isTap ? 'text-orange-400' : 'text-blue-400'}`}>
                    {isTap ? '👆' : '⏱'} +{upgrade.effectValue} {isTap ? 'per tap' : 'per sec'}
                  </span>
                </div>
              </div>

              {/* Buy button */}
              <motion.button
                whileTap={canAfford ? { scale: 0.92 } : {}}
                onClick={() => canAfford && buyUpgrade(upgrade.id)}
                className={[
                  'shrink-0 flex flex-col items-center justify-center rounded-xl px-3 py-2 min-w-[72px] transition-all duration-200',
                  canAfford
                    ? 'cursor-pointer'
                    : 'cursor-not-allowed opacity-50',
                ].join(' ')}
                style={
                  canAfford
                    ? { background: 'linear-gradient(135deg, #facc15, #f97316)' }
                    : { background: 'rgba(255,255,255,0.08)' }
                }
              >
                <span className="text-[10px] font-bold text-black/60 leading-none mb-0.5">🪙</span>
                <span className={`text-xs font-black leading-tight ${canAfford ? 'text-black' : 'text-white/40'}`}>
                  {cost >= 1_000_000
                    ? `${(cost / 1_000_000).toFixed(1)}M`
                    : cost >= 1_000
                    ? `${(cost / 1_000).toFixed(1)}K`
                    : cost}
                </span>
              </motion.button>
            </motion.div>
          )
        })}

        {/* Bottom spacer */}
        <div className="h-2" />
      </div>
    </div>
  )
}
