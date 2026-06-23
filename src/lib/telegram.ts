import WebApp from '@twa-dev/sdk'

// true only when running inside Telegram
export const isInTelegram = Boolean(WebApp.initData)

export const tgUser = WebApp.initDataUnsafe?.user ?? null

// Initialise the Mini App — call once at startup
export function initTelegram() {
  WebApp.ready()    // tell TG the app has loaded (removes loading indicator)
  WebApp.expand()   // request full-screen height

  try {
    WebApp.setHeaderColor('#1a0533')
    WebApp.setBackgroundColor('#070514')
  } catch {
    // older TG clients may not support these
  }
}

// Impact haptic (coin tap, button press)
export function haptic(style: 'light' | 'medium' | 'heavy' = 'medium') {
  if (!isInTelegram) return
  WebApp.HapticFeedback.impactOccurred(style)
}

// Notification haptic (level up, collect reward)
export function notifyHaptic(type: 'success' | 'warning' | 'error' = 'success') {
  if (!isInTelegram) return
  WebApp.HapticFeedback.notificationOccurred(type)
}
