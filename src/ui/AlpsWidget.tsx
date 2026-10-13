import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import WebView, { WebViewMessageEvent } from 'react-native-webview'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { AlpsConfig } from '../config/AlpsConfig'

/**
 * Loads the real Alps widget (alps-widget/frame) directly, in its "native" boot mode -
 * everything the chat UI needs (home/messages/chat/search, real-time updates) lives in that one
 * page now; this component is just a thin shell: load the URL, surface loading/error state, and
 * translate the page's own outbound messages (close) into dismissing the modal. No native
 * reimplementation of the chat UI lives here anymore - see docs/ALPS_MOBILE_ARCHITECTURE.md's
 * widget-consolidation plan for why, and the iOS/Android SDKs' own equivalent rewrites (same
 * URL, same message contract, just reached through react-native-webview's onMessage instead of
 * WKScriptMessageHandler or addJavascriptInterface).
 *
 * Public props are unchanged from the previous independent-implementation version - a non-
 * breaking upgrade for any existing consumer.
 */
interface AlpsWidgetProps {
  config: AlpsConfig
  visible?: boolean
  onClose?: () => void
}

// Real bug found live: this was 'https://tryalps.com/frame' - wrong domain. alps-widget is its
// own deployed service at cdn.tryalps.com (confirmed by reading its server.js and alps-frontend's
// own MarketingWidget.jsx directly), not part of tryalps.com, which now redirects to alpscx.com
// and doesn't serve /frame at all - this was silently loading alpscx.com's landing page instead
// of the widget.
const FRAME_URL = 'https://cdn.tryalps.com/frame'
const DARK = '#18181B'

function buildEmbedUrl(config: AlpsConfig): string {
  const params = new URLSearchParams({ native: '1', widgetKey: config.widgetKey })
  if (config.visitorName) params.set('userName', config.visitorName)
  if (config.visitorEmail) params.set('userEmail', config.visitorEmail)
  return `${FRAME_URL}?${params.toString()}`
}

export const AlpsWidget: React.FC<AlpsWidgetProps> = ({
  config,
  visible: externalVisible,
  onClose: externalOnClose,
}) => {
  const [visible, setVisible] = useState(externalVisible ?? false)
  const [loading, setLoading] = useState(true)
  // Real gap found live: this was a plain boolean, so the real failure reason main.js's boot()
  // sends via sendToHost(MSG.ERROR, {message: String(e?.message || e)}) was received and then
  // immediately thrown away - only ever showing a generic "check your connection" message
  // regardless of what actually failed (bad JSON, a non-200, a network error, anything). Carrying
  // the real string here is what actually makes this error screen useful for diagnosing why,
  // instead of a dead end every time.
  const [error, setError] = useState<string | null>(null)
  // Real bug found live (tsc, not guessed): `WebView<P = undefined>` - its default generic
  // parameter - makes `WebViewProps & P` collapse to `never` in react-native-webview@13.17.0's
  // own type declarations when no type argument is given, breaking every prop. `<{}>` here and
  // on the JSX element below is the fix, not a style choice.
  const webViewRef = useRef<WebView<{}>>(null)

  useEffect(() => {
    if (externalVisible !== undefined) {
      setVisible(externalVisible)
    }
  }, [externalVisible])

  // Reset to a fresh loading state each time the panel opens, matching the iOS/Android SDKs'
  // own "spinner until loaded, error+retry on failure" behavior.
  useEffect(() => {
    if (visible) {
      setLoading(true)
      setError(null)
    }
  }, [visible])

  const embedUrl = useMemo(
    () => buildEmbedUrl(config),
    [config.widgetKey, config.visitorName, config.visitorEmail]
  )

  const handleClose = useCallback(() => {
    setVisible(false)
    externalOnClose?.()
  }, [externalOnClose])

  // The frame's own envelope shape ({src:'alps', v:1, type, payload} - see alps-widget/src/
  // protocol.js). react-native-webview's bridge is string-only (same convention Android's
  // addJavascriptInterface uses, unlike iOS's WKScriptMessageHandler which gets the object
  // directly) - the frame JSON-stringifies before calling window.ReactNativeWebView.postMessage.
  const handleMessage = useCallback(
    (event: WebViewMessageEvent) => {
      try {
        const envelope = JSON.parse(event.nativeEvent.data)
        if (envelope?.src !== 'alps') return
        if (envelope.type === 'RESIZE' && envelope.payload?.state === 'hidden') {
          // hideWidget() in the frame sends RESIZE{state:'hidden'} for both an explicit close()
          // call and minimize-to-nothing - either way, the modal should dismiss. No separate
          // CLOSE message exists in the protocol; this is the real signal to listen for.
          handleClose()
        } else if (envelope.type === 'ERROR') {
          setError(typeof envelope.payload?.message === 'string' ? envelope.payload.message : 'Unknown error')
        }
      } catch {
        // Malformed/unexpected message - ignore rather than crash the host app.
      }
    },
    [handleClose]
  )

  const retry = useCallback(() => {
    setError(null)
    setLoading(true)
    webViewRef.current?.reload()
  }, [])

  return (
    <View style={styles.container}>
      {!visible && (
        <Pressable style={styles.launcher} onPress={() => setVisible(true)}>
          <MaterialCommunityIcons name="chat" size={18} color="#FFFFFF" style={styles.launcherIcon} />
          <Text style={styles.launcherText}>Chat with us</Text>
        </Pressable>
      )}

      {/* Real bug found live, screenshotted: "pageSheet" is iOS's card-style presentation - it
          leaves a visible margin/gap around the sheet (and dims/peeks the screen behind it),
          which is why the close button and a stray dev-menu icon appeared to float outside the
          white card's edge instead of sitting cleanly inside a full native screen. "fullScreen"
          covers the entire display edge-to-edge, matching how the Android SDK's native Activity
          and the iOS SDK's full-bleed WKWebView already present it - this was the one host that
          didn't match. */}
      <Modal visible={visible} animationType="slide" presentationStyle="fullScreen" onRequestClose={handleClose}>
        {/* Real bug found live, screenshotted side by side against Kuda/Intercom's widget: a
            plain View here let the WebView (and the dark header card the real widget frame
            renders inside it) extend all the way to the physical top of the screen, under the
            status bar/notch/Dynamic Island entirely - covering system UI instead of sitting below
            it like every reference example does. SafeAreaView alone didn't fix it: react-native's
            Modal renders its children in a separate native view hierarchy, which a host app's own
            top-level SafeAreaProvider doesn't reliably reach into - confirmed live, screenshotted
            again, the Dynamic Island was still covered after switching to SafeAreaView alone.
            Wrapping a SafeAreaProvider here too makes this self-contained: AlpsWidget now carries
            its own correct insets regardless of whether/how a consuming app set one up outside its
            own Modal boundary. */}
        <SafeAreaProvider>
        <SafeAreaView style={styles.modalContainer}>
          {/* Real bug found live, screenshotted repeatedly, against Kuda/Intercom's reference: a
              position:'absolute' close button is measured from the parent's padding EDGE, not its
              content box - so SafeAreaView's top padding (which correctly pushes the WebView below
              the notch) had zero effect on it, and no inset offset ever looked right: too small and
              it touched the status bar, large enough to clear the status bar and it landed on top
              of the widget's own dark themed header instead - overlapping one or the other no matter
              the number. The actual fix is this row itself: a plain, normal-flow View, in the exact
              neutral gap SafeAreaView already reserves between the status bar and this screen's
              content - so the button sits in that gap, touching neither, with zero manual offset. */}
          <View style={styles.closeBar}>
            <Pressable style={styles.closeButton} onPress={handleClose}>
              <MaterialCommunityIcons name="close" size={20} color="#3F3F46" />
            </Pressable>
          </View>

          <View style={styles.webviewContainer}>
            <WebView<{}>
              ref={webViewRef}
              source={{ uri: embedUrl }}
              style={styles.webview}
              onMessage={handleMessage}
              onError={(e) => setError(e.nativeEvent.description || 'WebView failed to load')}
              onHttpError={(e) => setError(`HTTP ${e.nativeEvent.statusCode} loading the widget`)}
              onLoadEnd={() => setLoading(false)}
              javaScriptEnabled
              domStorageEnabled
            />

            {/* Real gap fixed: there was previously no error state at all in this SDK's chat UI -
                a failed load just left whatever the last rendered state was, with no way to retry. */}
            {loading && !error && (
              <View style={styles.overlay} pointerEvents="none">
                <ActivityIndicator size="large" color={DARK} />
              </View>
            )}
            {error && (
              <View style={styles.overlay}>
                <Text style={styles.errorText}>Couldn't load chat.</Text>
                <Text style={styles.errorDetailText}>{error}</Text>
                <Pressable style={styles.retryButton} onPress={retry}>
                  <Text style={styles.retryButtonText}>Retry</Text>
                </Pressable>
              </View>
            )}
          </View>
        </SafeAreaView>
        </SafeAreaProvider>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'box-none',
  },
  launcher: {
    position: 'absolute',
    bottom: 28,
    right: 28,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 17,
    paddingVertical: 8,
    borderRadius: 24,
    backgroundColor: DARK,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 5,
    elevation: 5,
  },
  launcherIcon: {
    marginRight: 8,
  },
  launcherText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  // The neutral strip itself - normal flow, so SafeAreaView's own top padding already pushes it
  // below the status bar/notch; a fixed height here (not flex) keeps it a thin bar rather than a
  // large blank header, and its white background matches modalContainer so there's no visible
  // seam above it, only below it where the WebView's own dark themed header begins.
  closeBar: {
    height: 44,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  webviewContainer: {
    flex: 1,
    position: 'relative',
  },
  webview: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 15,
    color: '#3F3F46',
    textAlign: 'center',
    marginBottom: 4,
  },
  errorDetailText: {
    fontSize: 13,
    color: '#71717A',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: DARK,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  // Now sitting on closeBar's plain white background (not floating over the widget's own dark
  // header), so the previous dark semi-transparent circle + white icon - built for contrast
  // against a dark background - would itself be the wrong contrast here. A soft neutral circle
  // with a dark icon matches how Intercom/Kuda render this same neutral-gap close control.
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.06)',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
