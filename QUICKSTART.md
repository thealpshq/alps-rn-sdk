# Quick Start - 5 Minutes

Get Alps widget in your React Native app in 5 minutes.

## Step 1: Install

```bash
npm install @tryalps/rn-widget
npm install @react-native-async-storage/async-storage react-native-webview
```

## Step 2: Get Widget Key

1. Open [Alps Dashboard](https://dashboard.tryalps.com)
2. Go to Settings → API Keys
3. Copy your **Widget Key**

## Step 3: Add to Your App

Replace your `App.tsx` with this:

```tsx
import React from 'react'
import { View } from 'react-native'
import { AlpsWidget, createAlpsConfig } from '@tryalps/rn-widget'

export default function App() {
  const config = createAlpsConfig('YOUR_WIDGET_KEY_HERE', {
    visitorName: 'John Doe',
    visitorEmail: 'john@example.com',
  })

  return (
    <View style={{ flex: 1 }}>
      {/* Your app */}
      <View style={{ flex: 1, backgroundColor: '#fff' }} />

      {/* Alps Widget */}
      <AlpsWidget config={config} />
    </View>
  )
}
```

## Step 4: Run

```bash
npx expo start
```

Then:
- **iOS:** Open Expo Go app → Scan QR from terminal
- **Android:** Open Expo Go app → Scan QR from terminal
- **Web:** Press `w` in terminal

## Step 5: Test

1. Tap the blue chat button in bottom-right
2. See the support widget open
3. Click tabs: Home → Messages → Answers
4. Done! 🎉

## Next Steps

### Customize Widget Key
Replace `'YOUR_WIDGET_KEY_HERE'` with your actual key from Alps Dashboard.

### Pre-fill Visitor Info
```tsx
const config = createAlpsConfig('your-widget-key', {
  visitorName: 'User Name',
  visitorEmail: 'user@example.com',
})
```

### Show/Hide Programmatically
```tsx
const [visible, setVisible] = useState(false)

return (
  <>
    <AlpsWidget config={config} visible={visible} onClose={() => setVisible(false)} />
    <Button onPress={() => setVisible(true)}>Open Support</Button>
  </>
)
```

### Access Widget State
```tsx
import { useWidgetStore } from '@tryalps/rn-widget'

function MyComponent() {
  const { messages, conversationStatus } = useWidgetStore()
  return <Text>Messages: {messages.length}</Text>
}
```

## Common Issues

**Widget not showing?**
- Check widget key is correct (copy from dashboard)
- Check internet connection
- Check console for errors (Cmd+D on iOS, Cmd+M on Android)

**Module not found?**
```bash
npm install @tryalps/rn-widget @react-native-async-storage/async-storage react-native-webview
```

**Styles look wrong?**
```bash
npx expo start --clear
```

## Examples

See `/examples` folder for:
- `basic-app.tsx` - Simple integration
- `with-auth-app.tsx` - User authentication
- `custom-styling-app.tsx` - Advanced customization

## Full Documentation

- **Integration Guide:** [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)
- **API Reference:** [README.md](./README.md)
- **Examples:** [examples/README.md](./examples/README.md)

## Get Help

- **Docs:** https://docs.tryalps.com
- **Email:** support@tryalps.com
- **GitHub:** https://github.com/tryalps/rn-widget
- **Slack:** https://slack.tryalps.com

---

That's it! You now have a fully functional customer support widget. 🚀
