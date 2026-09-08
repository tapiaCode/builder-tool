import { Capacitor } from '@capacitor/core'
import { StatusBar, Style } from '@capacitor/status-bar'
import { SplashScreen } from '@capacitor/splash-screen'
import { App as CapApp } from '@capacitor/app'
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics'
import { Keyboard } from '@capacitor/keyboard'
import type { Ref } from 'vue'

export const isNative = Capacitor.isNativePlatform()

/**
 * Triggers light tactile feedback for UI taps/buttons
 */
export async function triggerHaptic(style: ImpactStyle = ImpactStyle.Light) {
  if (!isNative) return
  try {
    await Haptics.impact({ style })
  } catch {
    // Ignore on unsupported platforms
  }
}

/**
 * Triggers notification vibration (success, warning, error)
 */
export async function triggerNotificationHaptic(type: NotificationType = NotificationType.Success) {
  if (!isNative) return
  try {
    await Haptics.notification({ type })
  } catch {
    // Ignore on unsupported platforms
  }
}

/**
 * Updates the native Android status bar icons (light/dark) to match the app theme
 */
export async function updateStatusBarStyle(isDark: boolean) {
  if (!isNative) return
  try {
    // Style.Dark gives white/light status bar icons (for dark backgrounds)
    // Style.Light gives dark status bar icons (for light backgrounds)
    await StatusBar.setStyle({
      style: isDark ? Style.Dark : Style.Light,
    })
  } catch (err) {
    console.warn('StatusBar style update failed:', err)
  }
}

/**
 * Initializes native Android integrations:
 * - StatusBar transparent overlay (fused with header)
 * - Dynamic theme sync (light/dark icons)
 * - Hardware back button handling
 * - Smooth splash screen fadeout
 */
export async function initCapacitor(isDarkRef: Ref<boolean>, activeTabRef: Ref<string>) {
  if (!isNative) return

  // 1. Configure Status Bar overlay for edge-to-edge immersion
  try {
    await StatusBar.setOverlaysWebView({ overlay: true })
    await updateStatusBarStyle(isDarkRef.value)
  } catch (err) {
    console.warn('StatusBar initialization warning:', err)
  }

  // 2. Hide Splash Screen cleanly once DOM is ready
  try {
    await SplashScreen.hide({ fadeOutDuration: 300 })
  } catch (err) {
    console.warn('SplashScreen hide warning:', err)
  }

  // 3. Android Hardware Back Button listener
  try {
    await CapApp.addListener('backButton', ({ canGoBack }) => {
      if (activeTabRef.value !== 'calculator') {
        // Return to main tab before closing app
        activeTabRef.value = 'calculator'
        triggerHaptic()
      } else if (canGoBack) {
        window.history.back()
      } else {
        // Exit application cleanly
        CapApp.exitApp()
      }
    })
  } catch (err) {
    console.warn('BackButton listener warning:', err)
  }

  // 4. Keyboard handling to ensure inputs stay visible
  try {
    await Keyboard.setAccessoryBarVisible({ isVisible: false })
  } catch {
    // Keyboard plugin methods may vary across platforms
  }
}
