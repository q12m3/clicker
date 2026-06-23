import { doc, setDoc, getDoc } from 'firebase/firestore'
import { signInAnonymously } from 'firebase/auth'
import { db, auth, isFirebaseEnabled } from '../lib/firebase'
import { useGameStore } from '../store/gameStore'

export interface RemoteSave {
  coins:         number
  coinsPerTap:   number
  passiveIncome: number
  level:         number
  energy:        number
  maxEnergy:     number
  regenRate:     number
  updatedAt:     number
}

export async function signInAnon(): Promise<string | null> {
  if (!isFirebaseEnabled || !auth) return null
  try {
    const { user } = await signInAnonymously(auth)
    return user.uid
  } catch {
    console.warn('[Firebase] Anonymous auth failed — using local storage only')
    return null
  }
}

export async function loadRemote(uid: string): Promise<RemoteSave | null> {
  if (!db) return null
  try {
    const snap = await getDoc(doc(db, 'users', uid))
    return snap.exists() ? (snap.data() as RemoteSave) : null
  } catch {
    console.warn('[Firebase] Load failed')
    return null
  }
}

export async function saveRemote(uid: string): Promise<void> {
  if (!db) return
  const s = useGameStore.getState()
  const data: RemoteSave = {
    coins:         s.coins,
    coinsPerTap:   s.coinsPerTap,
    passiveIncome: s.passiveIncome,
    level:         s.level,
    energy:        s.energy,
    maxEnergy:     s.maxEnergy,
    regenRate:     s.regenRate,
    updatedAt:     Date.now(),
  }
  try {
    await setDoc(doc(db, 'users', uid), data)
  } catch {
    console.warn('[Firebase] Save failed')
  }
}
