# How Users Add the Alps Widget to Their App

This comprehensive guide explains exactly how developers can integrate the Alps customer support widget into their React Native apps.

---

## The Short Answer (30 seconds)

```bash
npm install @tryalps/rn-widget
```

Then add this to your `App.tsx`:

```tsx
import { AlpsWidget, createAlpsConfig } from '@tryalps/rn-widget'

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      {/* Your app */}
      <AlpsWidget config={createAlpsConfig('YOUR_WIDGET_KEY')} />
    </View>
  )
}
```

Done! They now have a fully functional support widget.

---

## The Complete Guide

### Phase 1: Preparation (2 minutes)

**What users need:**
1. A React Native project (Expo or bare)
2. Node.js installed
3. An Alps account + Widget Key

**Get Widget Key:**
```
1. Go to https://dashboard.tryalps.com
2. Login
3. Settings → API Keys
4. Copy "Widget Key"
```

### Phase 2: Installation (1 minute)

**Install the package:**
```bash
npm install @tryalps/rn-widget
```

**Install peer dependencies:**
```bash
npm install @react-native-async-storage/async-storage react-native-webview
```

Or all at once:
```bash
npm install @tryalps/rn-widget @react-native-async-storage/async-storage react-native-webview
```

### Phase 3: Basic Setup (2 minutes)

**Option A: Simplest (Recommended for most)**

Replace your `App.tsx` with:

```tsx
import React from 'react'
import { View } from 'react-native'
import { AlpsWidget, createAlpsConfig } from '@tryalps/rn-widget'

export default function App() {
  const config = createAlpsConfig('YOUR_WIDGET_KEY')

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Your app content here */}

      {/* Alps Support Widget */}
      <AlpsWidget config={config} />
    </View>
  )
}
```

**Option B: With User Info (Recommended for authenticated apps)**

```tsx
import React from 'react'
import { View } from 'react-native'
import { AlpsWidget, createAlpsConfig } from '@tryalps/rn-widget'

export default function App() {
  // Get user info from your auth provider
  const user = useAuth() // from your app

  const config = createAlpsConfig('YOUR_WIDGET_KEY', {
    visitorName: user?.name,
    visitorEmail: user?.email,
  })

  return (
    <View style={{ flex: 1 }}>
      <YourAppContent />
      <AlpsWidget config={config} />
    </View>
  )
}
```

**Option C: With Control (Recommended for apps with support pages)**

```tsx
import React, { useState } from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { AlpsWidget, createAlpsConfig } from '@tryalps/rn-widget'

export default function App() {
  const [supportOpen, setSupportOpen] = useState(false)

  const config = createAlpsConfig('YOUR_WIDGET_KEY')

  return (
    <View style={{ flex: 1 }}>
      <YourAppContent />

      <TouchableOpacity onPress={() => setSupportOpen(true)}>
        <Text>Open Support</Text>
      </TouchableOpacity>

      <AlpsWidget
        config={config}
        visible={supportOpen}
        onClose={() => setSupportOpen(false)}
      />
    </View>
  )
}
```

### Phase 4: Test (2 minutes)

**Run the app:**
```bash
npx expo start
```

**In Expo Go (on phone):**
- Scan QR code from terminal
- See blue chat button in bottom-right
- Tap button → widget opens
- All features work!

---

## Configuration Options

### Basic Config

```tsx
const config = createAlpsConfig('your-widget-key')
```

### With Visitor Info

```tsx
const config = createAlpsConfig('your-widget-key', {
  visitorName: 'John Doe',        // optional
  visitorEmail: 'john@example.com' // optional
})
```

### Using Config Builder

```tsx
import { AlpsConfigBuilder } from '@tryalps/rn-widget'

const config = new AlpsConfigBuilder('your-widget-key')
  .setVisitorName('John')
  .setVisitorEmail('john@example.com')
  .build()
```

### Update Config Dynamically

```tsx
const config = useMemo(
  () => createAlpsConfig('key', {
    visitorName: user?.name,
    visitorEmail: user?.email,
  }),
  [user]
)
```

---

## Common Implementation Patterns

### Pattern 1: Always-On Widget (Launcher FAB)

```tsx
export default function App() {
  const config = createAlpsConfig('key')
  
  return (
    <View style={{ flex: 1 }}>
      <AppContent />
      {/* Widget shows FAB button automatically */}
      <AlpsWidget config={config} />
    </View>
  )
}
```

FAB shows in bottom-right corner. Tapping opens modal.

### Pattern 2: Support Tab/Page

```tsx
function SupportScreen() {
  const config = createAlpsConfig('key')
  
  return (
    <View style={{ flex: 1 }}>
      <AlpsWidget config={config} visible={true} />
    </View>
  )
}
```

Show widget on dedicated support page/tab.

### Pattern 3: Help Center with Modal

```tsx
function HelpScreen() {
  const [widgetOpen, setWidgetOpen] = useState(false)
  const config = createAlpsConfig('key')

  return (
    <ScrollView>
      <Text>FAQ</Text>
      <Button onPress={() => setWidgetOpen(true)}>
        Still need help? Chat with us
      </Button>

      <AlpsWidget
        config={config}
        visible={widgetOpen}
        onClose={() => setWidgetOpen(false)}
      />
    </ScrollView>
  )
}
```

Show widget in modal when user clicks help button.

### Pattern 4: Settings/Profile with Quick Access

```tsx
function SettingsScreen() {
  const [widgetOpen, setWidgetOpen] = useState(false)
  const { user } = useAuth()
  
  const config = createAlpsConfig('key', {
    visitorName: user.name,
    visitorEmail: user.email,
  })

  return (
    <ScrollView>
      <Text>Settings</Text>
      
      <ListItem
        title="Get Help"
        onPress={() => setWidgetOpen(true)}
      />

      <AlpsWidget
        config={config}
        visible={widgetOpen}
        onClose={() => setWidgetOpen(false)}
      />
    </ScrollView>
  )
}
```

Provide support access from settings screen.

---

## TypeScript Usage

The SDK is **fully typed**. IDE will provide autocomplete:

```tsx
import {
  AlpsWidget,           // Component
  createAlpsConfig,     // Config builder
  AlpsConfig,           // Type
  useWidgetStore,       // Hook
  useNavigation,        // Hook
  WidgetDataResponse,   // Type
  Message,              // Type
  Conversation,         // Type
} from '@tryalps/rn-widget'

// All props are typed
const config: AlpsConfig = createAlpsConfig('key')

// Widget props are typed
<AlpsWidget
  config={config}           // Type: AlpsConfig
  visible={boolean}         // Type: boolean
  onClose={() => void}      // Type: () => void
/>
```

---

## Accessing Widget State

Users can read widget state if needed:

```tsx
import { useWidgetStore } from '@tryalps/rn-widget'

function MyComponent() {
  // Get any widget state
  const {
    conversationId,      // Current conversation ID
    messages,            // All messages in conversation
    conversationStatus,  // 'open' | 'closed' | 'resolved'
    ticket,             // Current ticket (if any)
    csatSubmitted,      // Whether user voted
  } = useWidgetStore()

  return (
    <Text>
      Messages: {messages.length}
      Status: {conversationStatus}
    </Text>
  )
}
```

---

## Navigation Control

Users can control widget navigation:

```tsx
import { useNavigation } from '@tryalps/rn-widget'

function MyComponent() {
  const { navigate, back, currentView } = useNavigation()

  return (
    <>
      <Button onPress={() => navigate('home')}>
        Go to Home
      </Button>
      <Button onPress={() => back()}>
        Go Back
      </Button>
      <Text>Current: {currentView}</Text>
    </>
  )
}
```

---

## Environment Variables

Store widget key in environment:

```bash
# .env
EXPO_PUBLIC_ALPS_WIDGET_KEY=your-widget-key-here
```

In app:

```tsx
const config = createAlpsConfig(
  process.env.EXPO_PUBLIC_ALPS_WIDGET_KEY
)
```

---

## API Integration

The API client is available for direct use:

```tsx
import { AlpsAPIClient } from '@tryalps/rn-widget'

const client = new AlpsAPIClient('your-widget-key')

// Fetch widget data
const data = await client.fetchWidgetData()

// Send message directly
await client.sendMessage({
  widgetKey: 'key',
  email: 'user@example.com',
  message: 'Hello!',
})

// Search articles
const results = await client.search('how to reset password')
```

---

## Troubleshooting

### "Module not found" Error

```bash
npm install @tryalps/rn-widget
npm install @react-native-async-storage/async-storage
npm install react-native-webview
```

Then restart:
```bash
npx expo start --clear
```

### Widget Not Showing

1. **Check widget key** - Verify from Alps dashboard (Settings → API Keys)
2. **Check network** - Widget requires internet
3. **Check permissions** - iOS may need camera/mic permissions
4. **Check console** - Look for errors (Cmd+D on iOS, Cmd+M on Android)

Example error check:

```tsx
const config = createAlpsConfig('YOUR_WIDGET_KEY')
console.log('Widget key:', config.widgetKey) // Should not be YOUR_WIDGET_KEY
<AlpsWidget config={config} />
```

### Styles Look Wrong

```bash
npx expo start --clear
```

Clear Expo cache if styles don't update.

### TypeScript Errors

Ensure `@tryalps/rn-widget` is in package.json dependencies:

```json
{
  "dependencies": {
    "@tryalps/rn-widget": "^0.1.0",
    "react": "^18.2.0",
    "react-native": "^0.73.0"
  }
}
```

---

## Performance Tips

### 1. Memoize Config

```tsx
const config = useMemo(
  () => createAlpsConfig('key', { visitorEmail: user?.email }),
  [user?.email]
)
```

### 2. Lazy Load Widget

```tsx
const AlpsWidget = lazy(() => import('@tryalps/rn-widget'))

<Suspense fallback={<Spinner />}>
  <AlpsWidget config={config} />
</Suspense>
```

### 3. Separate Thread

Zustand handles this automatically - no action needed.

---

## Browser Support (Expo Web)

Widget works on web but with limitations:

```bash
npx expo start
# Press 'w' to open in browser
```

✅ Works:
- Home, Messages, Answers screens
- Category, Article browsing
- Search
- Basic styling

⚠️ Limited:
- Video playback (browser restrictions)
- File upload (placeholder UI)
- Pusher real-time (may have latency)

---

## Next Steps

**After basic setup:**

1. **Read QUICKSTART.md** - 5-minute overview
2. **Check INTEGRATION_GUIDE.md** - Full reference
3. **See examples/** folder - Working code
4. **Test in Expo Go** - Instant preview
5. **Deploy to production** - Build APK/IPA

---

## Support

Users can reach out:

- **QUICKSTART.md** - Fast start
- **INTEGRATION_GUIDE.md** - Complete docs
- **examples/** - Working apps
- **GitHub Issues** - Bug reports
- **Email:** support@tryalps.com
- **Slack:** [Community](https://slack.tryalps.com)

---

## Verification Checklist

After integration, users should verify:

- [ ] Launcher button visible (bottom-right)
- [ ] Tap launcher → modal opens
- [ ] Home tab shows categories
- [ ] Messages tab works
- [ ] Answers tab has search
- [ ] Can navigate back
- [ ] Chat view hides tab bar
- [ ] Closing and reopening preserves state

---

## Summary

**Users can add Alps in 5 minutes:**

```bash
npm install @tryalps/rn-widget
```

```tsx
<AlpsWidget config={createAlpsConfig('YOUR_WIDGET_KEY')} />
```

**That's it!** They have a fully functional customer support widget with:
- 12 complete screens
- Real-time messaging
- Message persistence
- Full navigation
- TypeScript support
- iOS + Android + Web

No backend changes needed. No API wiring needed. Works out of the box.

---

**Ready to help your customers. 🚀**
