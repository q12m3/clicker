type Tab = 'clicker' | 'shop' | 'stats' | 'friends'

interface BottomNavProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

const tabs: { id: Tab; icon: string; label: string }[] = [
  { id: 'clicker', icon: '🪙', label: 'Tap' },
  { id: 'shop',    icon: '🛒', label: 'Shop' },
  { id: 'stats',   icon: '📊', label: 'Stats' },
  { id: 'friends', icon: '👥', label: 'Friends' },
]

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="flex items-stretch bg-black/40 backdrop-blur-md border-t border-white/10">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={[
              'flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 transition-all duration-200',
              isActive
                ? 'text-yellow-400'
                : 'text-white/40 active:text-white/70',
            ].join(' ')}
          >
            <span className={`text-xl transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
              {tab.icon}
            </span>
            <span className={`text-[10px] font-medium ${isActive ? 'font-bold' : ''}`}>
              {tab.label}
            </span>
            {isActive && (
              <span className="w-1 h-1 rounded-full bg-yellow-400 mt-0.5" />
            )}
          </button>
        )
      })}
    </nav>
  )
}
