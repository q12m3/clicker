export type EffectType = 'coinsPerTap' | 'passiveIncome'

export interface UpgradeConfig {
  id:             string
  name:           string
  description:    string
  icon:           string
  baseCost:       number
  costMultiplier: number
  effect:         EffectType
  effectValue:    number
}

export const UPGRADES: UpgradeConfig[] = [
  {
    id: 'tap_1', name: 'Coin Gloves', icon: '🧤',
    description: 'Enchanted gloves boost every tap',
    baseCost: 100, costMultiplier: 1.5,
    effect: 'coinsPerTap', effectValue: 1,
  },
  {
    id: 'passive_1', name: 'Auto Tapper', icon: '🤖',
    description: 'A robot taps coins while you rest',
    baseCost: 500, costMultiplier: 1.5,
    effect: 'passiveIncome', effectValue: 1,
  },
  {
    id: 'tap_2', name: 'Diamond Hands', icon: '💎',
    description: 'Premium fingertips, premium rewards',
    baseCost: 2_000, costMultiplier: 1.7,
    effect: 'coinsPerTap', effectValue: 5,
  },
  {
    id: 'passive_2', name: 'Mining Rig', icon: '⛏️',
    description: 'ASICs running hot around the clock',
    baseCost: 8_000, costMultiplier: 1.7,
    effect: 'passiveIncome', effectValue: 5,
  },
  {
    id: 'tap_3', name: 'Crypto Wizard', icon: '🧙',
    description: 'Ancient on-chain magic per tap',
    baseCost: 50_000, costMultiplier: 2.0,
    effect: 'coinsPerTap', effectValue: 25,
  },
  {
    id: 'passive_3', name: 'DeFi Farm', icon: '🌾',
    description: 'Yield-farming protocol — pure passive',
    baseCost: 200_000, costMultiplier: 2.0,
    effect: 'passiveIncome', effectValue: 50,
  },
]

export const getUpgradeCost = (config: UpgradeConfig, level: number): number =>
  Math.floor(config.baseCost * Math.pow(config.costMultiplier, level))
