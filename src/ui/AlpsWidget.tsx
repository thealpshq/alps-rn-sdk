import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from 'react-native'
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
  const [error, setError] = useState(false)
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
      setError(false)
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
          setError(true)
        }
      } catch {
        // Malformed/unexpected message - ignore rather than crash the host app.
      }
    },
    [handleClose]
  )

  const retry = useCallback(() => {
    setError(false)
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

      <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={handleClose}>
        <View style={styles.modalContainer}>
          <WebView<{}>
            ref={webViewRef}
            source={{ uri: embedUrl }}
            style={styles.webview}
            onMessage={handleMessage}
            onError={() => setError(true)}
            onHttpError={() => setError(true)}
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
              <Text style={styles.errorText}>Couldn't load chat. Check your connection and try again.</Text>
              <Pressable style={styles.retryButton} onPress={retry}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </Pressable>
            </View>
          )}

          <Pressable style={styles.closeButton} onPress={handleClose}>
            <MaterialCommunityIcons name="close" size={24} color={DARK} />
          </Pressable>
        </View>
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
    position: 'relative',
    backgroundColor: '#FFFFFF',
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
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
})
