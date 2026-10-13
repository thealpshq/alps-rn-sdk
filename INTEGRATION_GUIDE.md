# Alps React Native Widget - Integration Guide

This guide shows how to add the Alps customer support widget to your React Native app.

## Installation

### via npm

```bash
npm install @tryalps/rn-widget
```

### via yarn

```bash
yarn add @tryalps/rn-widget
```

### Peer Dependencies

The SDK requires these packages (install if not already present):

```bash
npm install react-native @react-native-async-storage/async-storage react-native-webview
```

## Basic Setup

### 1. Wrap Your App with the Widget

In your root component (e.g., `App.tsx`):

```tsx
import { AlpsWidget, createAlpsConfig } from '@tryalps/rn-widget'
import React, { useState } from 'react'
import { View } from 'react-native'

export default function App() {
  const [widgetVisible, setWidgetVisible] = useState(false)

  // Create config with your widget key from Alps dashboard
  const config = createAlpsConfig('your-widget-key-here', {
    visitorName: 'John Doe',
    visitorEmail: 'john@example.com',
  })

  return (
    <View style={{ flex: 1 }}>
      {/* Your app content */}
      <YourAppContent />

      {/* Alps widget - renders as FAB + modal */}
      <AlpsWidget config={config} />
    </View>
  )
}
```

### 2. Get Your Widget Key

1. Log in to [Alps Dashboard](https://dashboard.tryalps.com)
2. Go to **Settings** → **API Keys** → **Widget Key**
3. Copy your widget key
4. Replace `'your-widget-key-here'` in the code above

## Configuration Options

```tsx
interface AlpsConfig {
  widgetKey: string        // Required: from Alps dashboard
  visitorName?: string     // Optional: visitor's name
  visitorEmail?: string    // Optional: visitor's email
  conversationId?: string  // Optional: existing conversation ID
  pusherKey?: string       // Populated from API
  pusherCluster?: string   // Populated from API
}
```

### Using Config Builder

For more control:

```tsx
import { AlpsConfigBuilder } from '@tryalps/rn-widget'

const config = new AlpsConfigBuilder('your-widget-key-here')
  .setVisitorName('John Doe')
  .setVisitorEmail('john@example.com')
  .build()
```

## Common Use Cases

### 1. Dynamic Visitor Information

Update visitor info based on authenticated user:

```tsx
import { AlpsWidget, createAlpsConfig } from '@tryalps/rn-widget'
import { useAuth } from './context/AuthContext'

export default function App() {
  const { user } = useAuth()

  const config = createAlpsConfig(
    'your-widget-key-here',
    user
      ? {
          visitorName: user.firstName,
          visitorEmail: user.email,
        }
      : undefined
  )

  return <AlpsWidget config={config} />
}
```

### 2. Programmatic Widget Control

Show/hide the widget based on app state:

```tsx
import { AlpsWidget, createAlpsConfig } from '@tryalps/rn-widget'
import { useState } from 'react'

export default function App() {
  const [widgetVisible, setWidgetVisible] = useState(false)

  const config = createAlpsConfig('your-widget-key-here')

  return (
    <>
      <AlpsWidget
        config={config}
        visible={widgetVisible}
        onClose={() => setWidgetVisible(false)}
      />

      <Button onPress={() => setWidgetVisible(true)}>
        Open Support
      </Button>
    </>
  )
}
```

### 3. Custom Styling

Override design tokens:

```tsx
import { T, AlpsWidget, createAlpsConfig } from '@tryalps/rn-widget'

// Modify token colors
const customThemeColor = '#FF6B35' // Brand color

export default function App() {
  const config = createAlpsConfig('your-widget-key-here')

  return (
    <AlpsWidget
      config={config}
      // The widget respects themeColor from API, but you can override here
    />
  )
}
```

## Advanced Features

### Accessing Widget State

If you need to access widget state (messages, conversation ID, etc.):

```tsx
import { useWidgetStore } from '@tryalps/rn-widget'

function MyComponent() {
  const {
    conversationId,
    messages,
    conversationStatus,
    ticket,
  } = useWidgetStore()

  return (
    <Text>
      Conversation: {conversationId}
      Messages: {messages.length}
      Status: {conversationStatus}
    </Text>
  )
}
```

### Navigation Control

Access the navigation stack:

```tsx
import { useNavigation } from '@tryalps/rn-widget'

function MyComponent() {
  const { navigate, back, currentView } = useNavigation()

  return (
    <View>
      <Button onPress={() => navigate('home')}>
        Go to Home
      </Button>
      <Button onPress={() => back()}>
        Go Back
      </Button>
      <Text>Current view: {currentView}</Text>
    </View>
  )
}
```

### Custom API Client

For advanced use cases, access the API client directly:

```tsx
import { AlpsAPIClient } from '@tryalps/rn-widget'

const client = new AlpsAPIClient('your-widget-key-here')

// Fetch widget data
const data = await client.fetchWidgetData()

// Send message
await client.sendMessage({
  widgetKey: 'your-widget-key-here',
  email: 'user@example.com',
  message: 'Hello!',
})

// Search articles
const results = await client.search('how to reset password')
```

## Environment Variables

Optionally store sensitive config in environment variables:

```tsx
import { createAlpsConfig } from '@tryalps/rn-widget'

const config = createAlpsConfig(
  process.env.ALPS_WIDGET_KEY || 'fallback-key',
  {
    visitorEmail: process.env.ALPS_VISITOR_EMAIL,
  }
)
```

## Expo Configuration

If using Expo, ensure these plugins are installed:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-av",
        {
          "microphonePermission": "Allow Alps to access your microphone"
        }
      ]
    ]
  }
}
```

## Permissions

### iOS

Add to `Info.plist` (Expo handles this automatically):

```xml
<key>NSCameraUsageDescription</key>
<string>Alps needs camera access for video calls</string>
<key>NSMicrophoneUsageDescription</key>
<string>Alps needs microphone access for voice messages</string>
```

### Android

Add to `AndroidManifest.xml` (Expo handles this automatically):

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
```

## Troubleshooting

### Widget Not Showing

1. **Check widget key:** Ensure `widgetKey` is correct from Alps dashboard
2. **Check internet:** Widget requires network to fetch data
3. **Check console:** Look for errors in React Native debugger

```tsx
// Enable debug logging
console.log('[AlpsWidget] Initializing with key:', config.widgetKey)
```

### Styles Look Wrong

1. **Check design tokens:** Widget uses standard React Native styles (no web CSS)
2. **Screen size:** Widget is optimized for 360×592px (standard mobile)
3. **Font:** Ensure Inter font is available (default RN sans-serif)

### Network Errors

1. **API endpoint:** Verify `https://api.tryalps.com/api/v1` is accessible
2. **CORS:** Not applicable (native app), but check Pusher cluster
3. **Firewall:** Corporate networks may block Pusher (port 6379)

## TypeScript Support

Full TypeScript support included:

```tsx
import {
  AlpsWidget,
  AlpsConfig,
  WidgetDataResponse,
  Message,
  Conversation,
} from '@tryalps/rn-widget'

const config: AlpsConfig = {
  widgetKey: 'your-key',
  visitorEmail: 'user@example.com',
}

// All props are typed
const widget: JSX.Element = <AlpsWidget config={config} />
```

## Performance Tips

1. **Memoize config:** Avoid recreating config on every render
   ```tsx
   const config = useMemo(() => createAlpsConfig('key'), [])
   ```

2. **Lazy load:** Load widget only when needed
   ```tsx
   const AlpsWidget = lazy(() => import('@tryalps/rn-widget'))
   ```

3. **Separate thread:** Run heavy operations off main thread (already done with Zustand)

## Browser Support (Expo Web)

Widget works on Expo web but with limitations:

- Video playback via WebView works
- File upload UI is placeholder only
- Pusher real-time may have latency

## Support

For issues or questions:

1. **Documentation:** [https://docs.tryalps.com](https://docs.tryalps.com)
2. **GitHub Issues:** [https://github.com/tryalps/rn-widget/issues](https://github.com/tryalps/rn-widget/issues)
3. **Email:** support@tryalps.com
4. **Slack:** [Alps Community](https://slack.tryalps.com)

## Example Apps

See `/examples` folder for complete working apps:
- `examples/basic` - Simple integration
- `examples/auth` - With user authentication
- `examples/custom-styling` - Custom theme colors
- `examples/advanced` - Full feature showcase

## License

MIT - see LICENSE file for details

## Changelog

### v0.1.0 (Initial Release)

- ✅ All 12 screens (Home, Messages, Chat, Answers, Category, Article, Playlist, Video, History, HistoryDetail, Ticket, PreChatGate)
- ✅ Full navigation stack (viewStack + back button)
- ✅ Real-time messaging (Pusher integration)
- ✅ Message persistence (AsyncStorage)
- ✅ State management (Zustand)
- ✅ TypeScript support
- ✅ iOS + Android support
