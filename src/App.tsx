import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGameStore } from './store/gameStore'
import { useFirebaseSync } from './hooks/useFirebaseSync'
import Header from './components/Header'
import BottomNav from './components/BottomNav'
import OfflineEarningsModal from './components/OfflineEarningsModal'
import LevelUpModal from './components/LevelUpModal'
import ClickerPage from './pages/ClickerPage'
import ShopPage from './pages/ShopPage'
import StatsPage from './pages/StatsPage'
import FriendsPage from './pages/FriendsPage'
import './App.css'

type Tab = 'clicker' | 'shop' | 'stats' | 'friends'

const LAST_SEEN_KEY = 'clicker-last-seen'

interface OfflineEarnings { coins: number; energy: number; seconds: number }

export default function App() {
  const [activeTab, setActiveTab]               = useState<Tab>('clicker')
  const [offlineEarnings, setOfflineEarnings]   = useState<OfflineEarnings | null>(null)
  const [levelUpValue, setLevelUpValue]         = useState<number | null>(null)

  const tickEnergy   = useGameStore((s) => s.tickEnergy)
  const tickPassive  = useGameStore((s) => s.tickPassive)
  const applyOffline = useGameStore((s) => s.applyOffline)
  const level        = useGameStore((s) => s.level)

  const { isFirebaseEnabled: syncEnabled } = useFirebaseSync()

  // Level-up detection — ignore initial hydrated value
  const prevLevelRef    = useRef<number | null>(null)
  const isInitialRef    = useRef(true)
  useEffect(() => {
    if (isInitialRef.current) {
      isInitialRef.current = false
      prevLevelRef.current = level
      return
    }
    if (prevLevelRef.current !== null && level > prevLevelRef.current) {
      setLevelUpValue(level)
    }
    prevLevelRef.current = level
  }, [level])

  // Offline earnings — calculated once on mount
  useEffect(() => {
    const lastSeen = parseInt(localStorage.getItem(LAST_SEEN_KEY) ?? '0', 10)
    const now = Date.now()
    if (lastSeen > 0) {
      const elapsed = Math.max(0, Math.floor((now - lastSeen) / 1000))
      const { passiveIncome, regenRate, maxEnergy, energy } = useGameStore.getState()
      const offlineCoins  = Math.floor(elapsed * passiveIncome)
      const offlineEnergy = Math.min(elapsed * regenRate, maxEnergy - energy)
      if (offlineCoins > 0 || offlineEnergy > 0) {
        setOfflineEarnings({ coins: offlineCoins, energy: offlineEnergy, seconds: elapsed })
      }
    }
    const saveLastSeen = () => localStorage.setItem(LAST_SEEN_KEY, Date.now().toString())
    saveLastSeen()
    window.addEventListener('beforeunload', saveLastSeen)
    return () => window.removeEventListener('beforeunload', saveLastSeen)
  }, [])

  const handleCollect = () => {
    if (!offlineEarnings) return
    applyOffline(offlineEarnings.coins, offlineEarnings.energy)
    setOfflineEarnings(null)
  }

  useEffect(() => {
    const t = setInterval(tickEnergy, 1000)
    return () => clearInterval(t)
  }, [tickEnergy])

  useEffect(() => {
    const t = setInterval(tickPassive, 1000)
    return () => clearInterval(t)
  }, [tickPassive])

  const PAGE_MAP: Record<Tab, React.ReactNode> = {
    clicker: <ClickerPage />,
    shop:    <ShopPage />,
    stats:   <StatsPage />,
    friends: <FriendsPage />,
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#070514]">
      <div
        className="relative w-full max-w-[430px] h-screen max-h-[932px] flex flex-col overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #1a0533 0%, #0d0621 40%, #070514 100%)' }}
      >
        {/* Ambient glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-1/4 w-48 h-48 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />

        <Header syncEnabled={syncEnabled} />

        {/* Animated tab transitions */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeTab}
              className="absolute inset-0 flex flex-col"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              {PAGE_MAP[activeTab]}
            </motion.div>
          </AnimatePresence>
        </main>

        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <OfflineEarningsModal earnings={offlineEarnings} onCollect={handleCollect} />
      <LevelUpModal level={levelUpValue} onClose={() => setLevelUpValue(null)} />
    </div>
  )
}
