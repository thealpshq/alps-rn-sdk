/**
 * Alps Widget with Custom Styling and Control
 *
 * This example shows how to:
 * - Override design tokens and colors
 * - Programmatically show/hide the widget
 * - Access widget state and events
 * - Customize widget appearance
 *
 * Features:
 * - Customizable theme colors
 * - Show/hide widget via button
 * - Display current widget status
 *
 * Usage:
 * ```
 * npx expo install @tryalps/rn-widget
 * npm run start
 * ```
 */

import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
} from 'react-native'
import {
  AlpsWidget,
  createAlpsConfig,
  useWidgetStore,
  T,
} from '@tryalps/rn-widget'
import { MaterialCommunityIcons } from '@expo/vector-icons'

export default function CustomStylingApp() {
  const [widgetVisible, setWidgetVisible] = useState(false)
  const [themeColor, setThemeColor] = useState('#18181B')
  const [showStatus, setShowStatus] = useState(true)

  // Create config
  const config = createAlpsConfig('YOUR_WIDGET_KEY_HERE', {
    visitorName: 'Design User',
    visitorEmail: 'design@example.com',
  })

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.headerSection}>
          <Text style={styles.title}>Customize Widget</Text>
          <Text style={styles.subtitle}>Adjust appearance and behavior</Text>
        </View>

        {/* Theme Color Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Theme Color</Text>
          <View style={styles.colorGrid}>
            {[
              { name: 'Dark', color: '#18181B' },
              { name: 'Blue', color: '#3B82F6' },
              { name: 'Purple', color: '#8B5CF6' },
              { name: 'Red', color: '#EF4444' },
              { name: 'Green', color: '#10B981' },
              { name: 'Orange', color: '#F97316' },
            ].map((item) => (
              <TouchableOpacity
                key={item.name}
                style={[
                  styles.colorButton,
                  {
                    backgroundColor: item.color,
                    borderWidth: themeColor === item.color ? 3 : 1,
                    borderColor:
                      themeColor === item.color ? '#FFFFFF' : 'rgba(0,0,0,0.2)',
                  },
                ]}
                onPress={() => setThemeColor(item.color)}
              >
                {themeColor === item.color && (
                  <MaterialCommunityIcons
                    name="check"
                    size={20}
                    color="#FFFFFF"
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.colorValue}>Selected: {themeColor}</Text>
        </View>

        {/* Widget Visibility Control */}
        <View style={styles.section}>
          <View style={styles.controlRow}>
            <View>
              <Text style={styles.sectionTitle}>Widget Visibility</Text>
              <Text style={styles.description}>
                {widgetVisible
                  ? 'Widget is currently visible'
                  : 'Widget is hidden'}
              </Text>
            </View>
            <Switch
              value={widgetVisible}
              onValueChange={setWidgetVisible}
              trackColor={{ false: '#E4E4E7', true: '#A1A1AA' }}
              thumbColor={widgetVisible ? '#18181B' : '#FFFFFF'}
            />
          </View>

          {!widgetVisible && (
            <TouchableOpacity
              style={[styles.button, { backgroundColor: themeColor }]}
              onPress={() => setWidgetVisible(true)}
            >
              <MaterialCommunityIcons
                name="chat-outline"
                size={18}
                color="#FFFFFF"
              />
              <Text style={styles.buttonText}>Show Widget</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Status Display */}
        <View style={styles.section}>
          <View style={styles.controlRow}>
            <Text style={styles.sectionTitle}>Show Status</Text>
            <Switch
              value={showStatus}
              onValueChange={setShowStatus}
              trackColor={{ false: '#E4E4E7', true: '#A1A1AA' }}
              thumbColor={showStatus ? '#18181B' : '#FFFFFF'}
            />
          </View>
        </View>

        {/* Widget Status */}
        {showStatus && (
          <View style={styles.statusCard}>
            <WidgetStatus themeColor={themeColor} />
          </View>
        )}

        {/* Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <View style={styles.infoItem}>
            <MaterialCommunityIcons
              name="checkbox-marked-circle"
              size={20}
              color={themeColor}
            />
            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>Default Launcher</Text>
              <Text style={styles.infoDescription}>
                Widget shows FAB button in bottom-right corner by default
              </Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <MaterialCommunityIcons
              name="checkbox-marked-circle"
              size={20}
              color={themeColor}
            />
            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>Modal Panel</Text>
              <Text style={styles.infoDescription}>
                Tapping launcher slides up a modal with all chat features
              </Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <MaterialCommunityIcons
              name="checkbox-marked-circle"
              size={20}
              color={themeColor}
            />
            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>Real-time Updates</Text>
              <Text style={styles.infoDescription}>
                Messages sync in real-time via Pusher WebSocket
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.spacer} />
      </ScrollView>

      {/* Widget - only visible if widgetVisible is true */}
      {widgetVisible && (
        <AlpsWidget
          config={config}
          visible={widgetVisible}
          onClose={() => setWidgetVisible(false)}
        />
      )}
    </View>
  )
}

function WidgetStatus({ themeColor }: { themeColor: string }) {
  const {
    conversationId,
    conversationStatus,
    messages,
    ticket,
  } = useWidgetStore()

  return (
    <View>
      <Text style={styles.statusTitle}>Widget State</Text>

      <View style={styles.statusRow}>
        <Text style={styles.statusLabel}>Conversation ID:</Text>
        <Text style={styles.statusValue}>
          {conversationId || '(none)'}
        </Text>
      </View>

      <View style={styles.statusRow}>
        <Text style={styles.statusLabel}>Status:</Text>
        <Text style={styles.statusValue}>
          {conversationStatus || 'new'}
        </Text>
      </View>

      <View style={styles.statusRow}>
        <Text style={styles.statusLabel}>Messages:</Text>
        <Text style={styles.statusValue}>
          {messages.length}
        </Text>
      </View>

      <View style={styles.statusRow}>
        <Text style={styles.statusLabel}>Ticket:</Text>
        <Text style={styles.statusValue}>
          {ticket
            ? `#${ticket.ticketNumber} (${ticket.status})`
            : '(none)'}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  headerSection: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#18181B',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#71717A',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#18181B',
    marginBottom: 12,
  },
  description: {
    fontSize: 13,
    color: '#71717A',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  colorButton: {
    width: '32%',
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorValue: {
    fontSize: 13,
    color: '#A1A1AA',
    textAlign: 'center',
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  button: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  statusCard: {
    backgroundColor: '#F4F4F5',
    borderRadius: 12,
    padding: 16,
    borderWidth: 0.5,
    borderColor: '#E4E4E7',
    marginBottom: 24,
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#18181B',
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E4E4E7',
  },
  statusLabel: {
    fontSize: 13,
    color: '#71717A',
  },
  statusValue: {
    fontSize: 13,
    color: '#18181B',
    fontWeight: '600',
  },
  infoItem: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E4E4E7',
  },
  infoText: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#18181B',
    marginBottom: 2,
  },
  infoDescription: {
    fontSize: 13,
    color: '#71717A',
    lineHeight: 18,
  },
  spacer: {
    height: 32,
  },
})
