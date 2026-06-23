import { motion } from 'framer-motion'

const MOCK_FRIENDS = [
  { name: 'Alex_W',   coins: 342_000, online: true  },
  { name: 'Maria_K',  coins: 198_000, online: true  },
  { name: 'Denis_P',  coins:  87_500, online: false },
  { name: 'Yulia_T',  coins:  24_000, online: false },
  { name: 'Igor_M',   coins:   9_300, online: false },
]

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`
  return n.toLocaleString()
}

export default function FriendsPage() {
  const handleInvite = () => {
    if (navigator.share) {
      navigator.share({ title: 'Coin Clicker', text: 'Join me in Coin Clicker!', url: window.location.href })
    } else {
      navigator.clipboard?.writeText(window.location.href)
    }
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-4 pt-3 pb-2">
        <h2 className="text-white font-bold text-lg">Friends</h2>
      </div>

      {/* Invite card */}
      <div className="px-4 mb-3">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-4 flex flex-col gap-3"
          style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(250,204,21,0.08))', border: '1px solid rgba(168,85,247,0.25)' }}
        >
          <div className="flex items-center gap-3">
            <span className="text-4xl">🎁</span>
            <div>
              <p className="text-white font-bold text-sm">Invite a friend</p>
              <p className="text-white/50 text-xs mt-0.5">+5,000 coins for you and your friend</p>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleInvite}
            className="w-full py-2.5 rounded-xl font-bold text-black text-sm"
            style={{ background: 'linear-gradient(90deg, #facc15, #f97316)' }}
          >
            📤 Invite Friends
          </motion.button>
        </motion.div>
      </div>

      {/* Friends list */}
      <div
        className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-2"
        style={{ scrollbarWidth: 'none' }}
      >
        <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-1">
          Your friends ({MOCK_FRIENDS.length})
        </p>

        {MOCK_FRIENDS.map((friend, i) => (
          <motion.div
            key={friend.name}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            {/* Avatar */}
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                {friend.name[0]}
              </div>
              {friend.online && (
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-[#0d0621]" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <p className="text-white text-sm font-semibold">{friend.name}</p>
              <p className="text-white/40 text-xs">{friend.online ? 'Online now' : 'Offline'}</p>
            </div>

            {/* Coins */}
            <div className="flex items-center gap-1">
              <span className="text-yellow-400 text-xs">🪙</span>
              <span className="text-white/60 text-sm font-semibold tabular-nums">{fmt(friend.coins)}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
