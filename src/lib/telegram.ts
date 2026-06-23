// Graceful wrapper — works both inside and outside Telegram
const getTgWebApp = () => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (window as any)?.Telegram?.WebApp ?? null
  } catch {
    return null
  }
}

const WebApp = getTgWebApp()

export const isInTelegram = Boolean(WebApp?.initData)
export const tgUser: { first_name?: string; photo_url?: string } | null =
  WebApp?.initDataUnsafe?.user ?? null

export function initTelegram() {
  if (!WebApp) return
  try { WebApp.ready()  } catch {}
  try { WebApp.expand() } catch {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  try { (WebApp as any).requestFullscreen?.() } catch {}
  try { WebApp.setHeaderColor('#1a0533')    } catch {}
  try { WebApp.setBackgroundColor('#070514') } catch {}

  // Sync --tg-viewport-height on every Telegram viewport resize (e.g. half-sheet → full)
  let prevHeight = 0
  const syncHeight = () => {
    try {
      const h = WebApp.viewportHeight
      document.documentElement.style.setProperty('--tg-viewport-height', `${h}px`)
      if (!WebApp.isExpanded) WebApp.expand()
      // Sheet was dragged from half to full — reload so 100vh recalculates correctly
      if (prevHeight > 0 && h - prevHeight > 100) window.location.reload()
      prevHeight = h
    } catch {}
  }
  try { WebApp.onEvent('viewportChanged', syncHeight) } catch {}
  syncHeight()
}

export function haptic(style: 'light' | 'medium' | 'heavy' = 'medium') {
  if (!isInTelegram) return
  try { WebApp?.HapticFeedback?.impactOccurred(style) } catch {}
}

export function notifyHaptic(type: 'success' | 'warning' | 'error' = 'success') {
  if (!isInTelegram) return
  try { WebApp?.HapticFeedback?.notificationOccurred(type) } catch {}
}
