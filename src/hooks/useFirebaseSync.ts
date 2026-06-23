import { useEffect, useRef } from 'react'
import { isFirebaseEnabled } from '../lib/firebase'
import { signInAnon, loadRemote, saveRemote } from '../services/syncService'
import { useGameStore, calcLevel } from '../store/gameStore'

export function useFirebaseSync() {
  const uidRef      = useRef<string | null>(null)
  const syncedRef   = useRef(false)

  // Step 1 — authenticate + load remote save, merge with local (take highest coins)
  useEffect(() => {
    if (!isFirebaseEnabled) return

    signInAnon().then(async (uid) => {
      if (!uid) return
      uidRef.current = uid

      const remote = await loadRemote(uid)
      if (!remote) return

      const local = useGameStore.getState()

      if (remote.coins > local.coins) {
        useGameStore.setState({
          coins:         remote.coins,
          coinsPerTap:   remote.coinsPerTap,
          passiveIncome: remote.passiveIncome,
          level:         calcLevel(remote.coins),
          energy:        remote.energy,
          maxEnergy:     remote.maxEnergy,
          regenRate:     remote.regenRate,
        })
        console.info('[Firebase] Remote save loaded — higher progress found')
      }

      syncedRef.current = true
    })
  }, [])

  // Step 2 — auto-save every 15 seconds
  useEffect(() => {
    if (!isFirebaseEnabled) return
    const timer = setInterval(() => {
      if (uidRef.current) saveRemote(uidRef.current)
    }, 15_000)
    return () => clearInterval(timer)
  }, [])

  // Step 3 — save on tab close
  useEffect(() => {
    if (!isFirebaseEnabled) return
    const onUnload = () => { if (uidRef.current) saveRemote(uidRef.current) }
    window.addEventListener('beforeunload', onUnload)
    return () => window.removeEventListener('beforeunload', onUnload)
  }, [])

  return { isFirebaseEnabled }
}
