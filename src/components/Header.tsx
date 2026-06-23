import { useGameStore } from '../store/gameStore'
import { isFirebaseEnabled } from '../lib/firebase'
import { tgUser, isInTelegram } from '../lib/telegram'

interface HeaderProps {
  syncEnabled?: boolean
}

export default function Header({ syncEnabled = false }: HeaderProps) {
  const coins = useGameStore((s) => s.coins)
  const level = useGameStore((s) => s.level)

  const displayName = tgUser?.first_name ?? 'Player'
  const photoUrl    = tgUser?.photo_url   ?? null

  return (
    <header className="flex items-center justify-between px-4 pt-4 pb-2">
      {/* User info */}
      <div className="flex items-center gap-2">
        {/* Avatar — real TG photo or gradient fallback */}
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={displayName}
            className="w-9 h-9 rounded-full object-cover"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
            {displayName[0].toUpperCase()}
          </div>
        )}

        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-white text-sm font-semibold leading-tight">{displayName}</span>

            {/* TG badge */}
            {isInTelegram && (
              <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                TG
              </span>
            )}

            {/* Cloud sync badge */}
            {isFirebaseEnabled && (
              <span
                className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                  syncEnabled
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-white/10 text-white/30 border border-white/10'
                }`}
              >
                {syncEnabled ? '☁ SYNC' : '☁ ...'}
              </span>
            )}
          </div>
          <span className="text-purple-300 text-xs">Level {level}</span>
        </div>
      </div>

      {/* Coin balance */}
      <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1.5">
        <span className="text-yellow-400 text-lg leading-none">🪙</span>
        <span className="text-white font-bold text-sm tabular-nums">
          {coins.toLocaleString()}
        </span>
      </div>
    </header>
  )
}
