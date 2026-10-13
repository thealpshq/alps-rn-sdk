/**
 * Alps Widget with Authentication
 *
 * This example shows how to integrate Alps with user authentication.
 * Visitor name and email are populated from the authenticated user.
 *
 * Features:
 * - Login/logout flows
 * - Visitor info auto-updated from auth state
 * - Widget shows different info for logged-in vs anonymous users
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
  TextInput,
  ActivityIndicator,
} from 'react-native'
import { AlpsWidget, createAlpsConfig } from '@tryalps/rn-widget'
import { MaterialCommunityIcons } from '@expo/vector-icons'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

export default function WithAuthApp() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('user@example.com')
  const [name, setName] = useState('User')

  const handleLogin = async () => {
    setLoading(true)
    // Simulate login API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setUser({
      id: '123',
      name,
      email,
    })
    setLoading(false)
  }

  const handleLogout = () => {
    setUser(null)
    setEmail('')
    setName('')
  }

  // Create config based on auth state
  const config = createAlpsConfig('YOUR_WIDGET_KEY_HERE', {
    visitorName: user?.name,
    visitorEmail: user?.email,
  })

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#18181B" />
      </View>
    )
  }

  if (user) {
    return (
      <View style={styles.container}>
        {/* User logged in */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <MaterialCommunityIcons name="account-circle" size={48} color="#18181B" />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.card}>
            <MaterialCommunityIcons name="check-circle" size={32} color="#22C55E" />
            <Text style={styles.cardTitle}>Logged In</Text>
            <Text style={styles.cardText}>
              You're now logged in. The support team can identify you by your email and provide
              personalized assistance.
            </Text>
          </View>

          <View style={styles.card}>
            <MaterialCommunityIcons name="chat-outline" size={32} color="#3B82F6" />
            <Text style={styles.cardTitle}>Contact Support</Text>
            <Text style={styles.cardText}>
              Tap the chat button in the corner to start a conversation with our support team.
              Your email will be automatically filled in.
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <MaterialCommunityIcons name="logout" size={18} color="#FFFFFF" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <AlpsWidget config={config} />
      </View>
    )
  }

  // User not logged in
  return (
    <View style={styles.container}>
      <View style={styles.loginContainer}>
        <MaterialCommunityIcons name="lock-outline" size={48} color="#18181B" style={styles.lockIcon} />
        <Text style={styles.loginTitle}>Login to Continue</Text>
        <Text style={styles.loginSubtitle}>
          Enter your details to access support and personalized assistance
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
          placeholderTextColor="#A1A1AA"
        />

        <TextInput
          style={styles.input}
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#A1A1AA"
        />

        <TouchableOpacity
          style={[styles.loginBtn, { opacity: name && email ? 1 : 0.5 }]}
          onPress={handleLogin}
          disabled={!name || !email}
        >
          <Text style={styles.loginBtnText}>Login</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          You can also use support as a guest. The chat button in the corner works without logging in.
        </Text>
      </View>

      {/* Widget available for guest users too */}
      <AlpsWidget config={config} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 24,
    backgroundColor: '#F4F4F5',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E4E4E7',
  },
  avatar: {
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#18181B',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 13,
    color: '#71717A',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  card: {
    backgroundColor: '#F4F4F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: '#E4E4E7',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3F3F46',
    marginTop: 12,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 13,
    color: '#71717A',
    textAlign: 'center',
    lineHeight: 18,
  },
  logoutBtn: {
    flexDirection: 'row',
    backgroundColor: '#EF4444',
    marginHorizontal: 16,
    marginBottom: 24,
    paddingVertical: 12,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  lockIcon: {
    marginBottom: 16,
    alignSelf: 'center',
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#18181B',
    marginBottom: 8,
    textAlign: 'center',
  },
  loginSubtitle: {
    fontSize: 14,
    color: '#71717A',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#E4E4E7',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    fontSize: 14,
    color: '#18181B',
  },
  loginBtn: {
    backgroundColor: '#18181B',
    paddingVertical: 12,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  loginBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  disclaimer: {
    fontSize: 12,
    color: '#A1A1AA',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 16,
  },
})
