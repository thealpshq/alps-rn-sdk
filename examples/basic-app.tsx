/**
 * Basic Alps Widget Integration
 *
 * This is the simplest way to add Alps to your React Native app.
 *
 * Features:
 * - Launcher button in bottom-right corner
 * - Pre-filled visitor email
 * - All screens and navigation working
 *
 * Usage:
 * ```
 * npx expo install @tryalps/rn-widget
 * npm run start
 * ```
 */

import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { AlpsWidget, createAlpsConfig } from '@tryalps/rn-widget'

export default function BasicApp() {
  // Create Alps config with your widget key
  const config = createAlpsConfig('YOUR_WIDGET_KEY_HERE', {
    visitorName: 'John Doe',
    visitorEmail: 'john@example.com',
  })

  return (
    <View style={styles.container}>
      {/* Your app content */}
      <ScrollView style={styles.content}>
        <Text style={styles.title}>My App</Text>
        <Text style={styles.subtitle}>Tap the blue chat button in the bottom-right corner</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Help & Support</Text>
          <Text style={styles.cardText}>
            We're here to help! Click the chat button to get in touch with our support team.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Features</Text>
          <Text style={styles.cardText}>
            • View FAQs and articles{'\n'}
            • Search our knowledge base{'\n'}
            • Chat with support agents{'\n'}
            • Track support tickets
          </Text>
        </View>
      </ScrollView>

      {/* Alps Widget - renders as FAB + modal */}
      <AlpsWidget config={config} />
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#18181B',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#71717A',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#F4F4F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: '#E4E4E7',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3F3F46',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#71717A',
    lineHeight: 20,
  },
})
