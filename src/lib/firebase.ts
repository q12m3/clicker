import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { getAuth, type Auth } from 'firebase/auth'

const config = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
}

// Firebase is optional — game works fine without it (localStorage fallback)
export const isFirebaseEnabled =
  !!config.apiKey && config.apiKey !== 'undefined' && config.apiKey !== ''

let app:  FirebaseApp | null = null
let db:   Firestore   | null = null
let auth: Auth        | null = null

if (isFirebaseEnabled) {
  app  = initializeApp(config)
  db   = getFirestore(app)
  auth = getAuth(app)
}

export { app, db, auth }
