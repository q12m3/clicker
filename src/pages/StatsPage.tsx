import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useGameStore, LEVEL_THRESHOLDS } from '../store/gameStore'

// Static mock leaderboard — real player is inserted by rank
const MOCK_PLAYERS = [
  { name: 'CryptoKing',   coins: 12_500_000 },
  { name: 'TapMaster',    coins:  8_200_000 },
  { name: 'GoldFinger',   coins:  5_100_000 },
  { name: 'MoonWalker',   coins:  3_400_000 },
  { name: 'DiamondHnd',   coins:  1_900_000 },
  { name: 'HODLer',       coins:    950_000 },
  { name: 'DeFiKing',     coins:    420_000 },
  { name: 'WenMoon',      coins:    180_000 },
  { name: 'TapBoy',       coins:     45_000 },
  { name: 'CoinFan',      coins:     10_000 },
]

const LEVEL_AVATARS = ['🐣','🐣','🐤','🐤','🦊','🦊','🦁','🦁','🔱','👑']

function fmt(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`
  if (n >= 1_000_000)     return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)         return `${(n / 1_000).toFixed(1)}K`
  return n.toLocaleString()
}

export default function StatsPage() {
  const coins            = useGameStore((s) => s.coins)
  const level            = useGameStore((s) => s.level)
  const coinsPerTap      = useGameStore((s) => s.coinsPerTap)
  const passiveIncome    = useGameStore((s) => s.passiveIncome)
  const totalTaps        = useGameStore((s) => s.totalTaps)
  const totalCoinsEarned = useGameStore((s) => s.totalCoinsEarned)
  const upgradesPurchased= useGameStore((s) => s.upgradesPurchased)

  const upgradeCount = Object.values(upgradesPurchased).reduce((a, b) => a + b, 0)

  // Level progress
  const currentThreshold = LEVEL_THRESHOLDS[level - 1] ?? 0
  const nextThreshold    = LEVEL_THRESHOLDS[level] ?? null
  const isMaxLevel       = nextThreshold === null
  const levelPct         = isMaxLevel ? 1
    : (coins - currentThreshold) / (nextThreshold - currentThreshold)

  // Leaderboard: merge player into mock list, find rank
  const leaderboard = useMemo(() => {
    const all = [...MOCK_PLAYERS, { name: 'You', coins }]
    all.sort((a, b) => b.coins - a.coins)
    return all.slice(0, 11) // top 11 (in case player is 11th)
  }, [coins])

  const playerRank = leaderboard.findIndex((p) => p.name === 'You') + 1

  const stats = [
    { label: 'Total Earned', value: fmt(totalCoinsEarned), icon: '🪙' },
    { label: 'Total Taps',   value: fmt(totalTaps),        icon: '👆' },
    { label: 'Per Tap',      value: `+${coinsPerTap}`,     icon: '⚡' },
    { label: 'Per Second',   value: `+${passiveIncome}`,   icon: '⏱' },
    { label: 'Upgrades',     value: upgradeCount,          icon: '🔧' },
    { label: 'Rank',         value: `#${playerRank}`,      icon: '🏆' },
  ]

  return (
    <div
      className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-4"
      style={{ scrollbarWidth: 'none' }}
    >
      {/* Profile card */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-4 flex items-center gap-4 mt-3"
        style={{ background: 'linear-gradient(135deg, rgba(250,204,21,0.1), rgba(168,85,247,0.1))', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        <div className="text-5xl">{LEVEL_AVATARS[level - 1] ?? '👑'}</div>
        <div className="flex-1">
          <p className="text-white font-bold text-base">Player</p>
          <p className="text-purple-300 text-sm">Level {level}{isMaxLevel ? ' · MAX' : ''}</p>
          <p className="text-yellow-400/80 text-xs mt-0.5">🪙 {fmt(coins)} coins</p>
        </div>
        <div className="text-right">
          <p className="text-white/40 text-xs">Global rank</p>
          <p className="text-yellow-400 font-black text-2xl">#{playerRank}</p>
        </div>
      </motion.div>

      {/* Level progress */}
      {!isMaxLevel && (
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs text-white/50 px-0.5">
            <span>Level {level}</span>
            <span>{fmt(coins)} / {fmt(nextThreshold!)} → Level {level + 1}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #a855f7, #facc15)' }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(levelPct * 100, 100)}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-2">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl p-3 flex flex-col items-center gap-1"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <span className="text-xl">{s.icon}</span>
            <span className="text-white font-black text-base tabular-nums">{s.value}</span>
            <span className="text-white/40 text-[10px] text-center leading-tight">{s.label}</span>
          </motion.div>
        ))}
      </div>

      {/* Leaderboard */}
      <div className="flex flex-col gap-2">
        <h3 className="text-white/60 text-xs font-semibold uppercase tracking-wider px-0.5">
          🏆 Leaderboard
        </h3>
        {leaderboard.slice(0, 10).map((player, i) => {
          const isYou = player.name === 'You'
          const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : null
          return (
            <motion.div
              key={player.name + i}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.04 }}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5"
              style={{
                background: isYou
                  ? 'linear-gradient(135deg, rgba(250,204,21,0.12), rgba(249,115,22,0.08))'
                  : 'rgba(255,255,255,0.04)',
                border: isYou
                  ? '1px solid rgba(250,204,21,0.25)'
                  : '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <span className="w-6 text-center text-sm">
                {medal ?? <span className="text-white/30 text-xs font-bold">#{i + 1}</span>}
              </span>
              <span className={`flex-1 text-sm font-semibold ${isYou ? 'text-yellow-400' : 'text-white/80'}`}>
                {player.name}
              </span>
              <span className={`text-sm tabular-nums font-bold ${isYou ? 'text-yellow-400' : 'text-white/50'}`}>
                {fmt(player.coins)}
              </span>
            </motion.div>
          )
        })}
      </div>

      <div className="h-2" />
    </div>
  )
}
