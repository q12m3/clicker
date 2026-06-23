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

  // Re-expand if user somehow collapses the sheet
  try {
    WebApp.onEvent('viewportChanged', () => {
      if (!WebApp.isExpanded) {
        try { WebApp.expand() } catch {}
      }
    })
  } catch {}
}

export function haptic(style: 'light' | 'medium' | 'heavy' = 'medium') {
  if (!isInTelegram) return
  try { WebApp?.HapticFeedback?.impactOccurred(style) } catch {}
}

export function notifyHaptic(type: 'success' | 'warning' | 'error' = 'success') {
  if (!isInTelegram) return
  try { WebApp?.HapticFeedback?.notificationOccurred(type) } catch {}
}
