import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { UPGRADES, getUpgradeCost } from '../config/upgrades'

export const LEVEL_THRESHOLDS = [
  0, 1_000, 10_000, 50_000, 200_000,
  1_000_000, 5_000_000, 20_000_000, 100_000_000, 500_000_000,
]

export const calcLevel = (coins: number): number => {
  let level = 1
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (coins >= LEVEL_THRESHOLDS[i]) level = i + 1
  }
  return level
}

export const MAX_ENERGY  = 1000
export const REGEN_RATE  = 3
export const ENERGY_COST = 1

export interface GameState {
  coins:             number
  coinsPerTap:       number
  passiveIncome:     number
  level:             number
  energy:            number
  maxEnergy:         number
  regenRate:         number
  upgradesPurchased: Record<string, number>

  // Lifetime stats (never decrease)
  totalTaps:         number
  totalCoinsEarned:  number

  tap:              () => void
  tickEnergy:       () => void
  tickPassive:      () => void
  applyOffline:     (coins: number, energy: number) => void
  buyUpgrade:       (id: string) => void
  setCoinsPerTap:   (v: number) => void
  setPassiveIncome: (v: number) => void
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      coins:             0,
      coinsPerTap:       1,
      passiveIncome:     0,
      level:             1,
      energy:            MAX_ENERGY,
      maxEnergy:         MAX_ENERGY,
      regenRate:         REGEN_RATE,
      upgradesPurchased: {},
      totalTaps:         0,
      totalCoinsEarned:  0,

      tap: () =>
        set((s) => {
          if (s.energy < ENERGY_COST) return {}
          const newCoins = s.coins + s.coinsPerTap
          return {
            coins:            newCoins,
            energy:           s.energy - ENERGY_COST,
            level:            calcLevel(newCoins),
            totalTaps:        s.totalTaps + 1,
            totalCoinsEarned: s.totalCoinsEarned + s.coinsPerTap,
          }
        }),

      tickEnergy: () =>
        set((s) => ({ energy: Math.min(s.energy + s.regenRate, s.maxEnergy) })),

      tickPassive: () =>
        set((s) => {
          if (s.passiveIncome === 0) return {}
          const newCoins = s.coins + s.passiveIncome
          return {
            coins:            newCoins,
            level:            calcLevel(newCoins),
            totalCoinsEarned: s.totalCoinsEarned + s.passiveIncome,
          }
        }),

      applyOffline: (offlineCoins, offlineEnergy) =>
        set((s) => {
          const newCoins = s.coins + offlineCoins
          return {
            coins:            newCoins,
            energy:           Math.min(s.energy + offlineEnergy, s.maxEnergy),
            level:            calcLevel(newCoins),
            totalCoinsEarned: s.totalCoinsEarned + offlineCoins,
          }
        }),

      buyUpgrade: (id) =>
        set((s) => {
          const config = UPGRADES.find((u) => u.id === id)
          if (!config) return {}
          const level = s.upgradesPurchased[id] ?? 0
          const cost  = getUpgradeCost(config, level)
          if (s.coins < cost) return {}
          return {
            coins:             s.coins - cost,
            upgradesPurchased: { ...s.upgradesPurchased, [id]: level + 1 },
            coinsPerTap:       config.effect === 'coinsPerTap'
              ? s.coinsPerTap + config.effectValue : s.coinsPerTap,
            passiveIncome:     config.effect === 'passiveIncome'
              ? s.passiveIncome + config.effectValue : s.passiveIncome,
          }
        }),

      setCoinsPerTap:   (v) => set({ coinsPerTap: v }),
      setPassiveIncome: (v) => set({ passiveIncome: v }),
    }),
    {
      name: 'clicker-save-v1',
      partialize: (s) => ({
        coins:             s.coins,
        coinsPerTap:       s.coinsPerTap,
        passiveIncome:     s.passiveIncome,
        level:             s.level,
        energy:            s.energy,
        maxEnergy:         s.maxEnergy,
        regenRate:         s.regenRate,
        upgradesPurchased: s.upgradesPurchased,
        totalTaps:         s.totalTaps,
        totalCoinsEarned:  s.totalCoinsEarned,
      }),
    }
  )
)
