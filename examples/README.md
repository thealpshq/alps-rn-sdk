# Alps Widget Examples

Complete working examples showing how to integrate the Alps customer support widget into your React Native app.

## Examples

### 1. Basic App (`basic-app.tsx`)

The simplest integration. Perfect for getting started quickly.

**Features:**
- Simple setup with 5 lines of code
- Launcher FAB button in bottom-right corner
- Pre-filled visitor email
- All widget screens working

**Use this if:**
- You want a quick integration
- You're building a simple app
- You don't need authentication

**To run:**
```bash
# Copy basic-app.tsx content to your App.tsx
npx expo start
```

### 2. With Authentication (`with-auth-app.tsx`)

Integration with user authentication flow.

**Features:**
- Login/logout screens
- Visitor info auto-populated from auth state
- Anonymous guest support
- User profile display

**Use this if:**
- Your app has user authentication
- You want visitor info tied to logged-in users
- You want to show different UI for logged-in vs guest users

**To run:**
```bash
# Copy with-auth-app.tsx content to your App.tsx
npx expo start
```

**Mock Login Credentials:**
- Email: any email address
- Name: any name
- Password: not required (simulated for demo)

### 3. Custom Styling (`custom-styling-app.tsx`)

Advanced example with customization and programmatic control.

**Features:**
- Theme color picker (6 brand colors)
- Programmatic show/hide via toggle
- Widget state display
- Real-time status updates
- Custom control buttons

**Use this if:**
- You want to customize widget appearance
- You need programmatic control
- You want to monitor widget state
- You're building a complex integration

**To run:**
```bash
# Copy custom-styling-app.tsx content to your App.tsx
npx expo start
```

**What You Can Do:**
- Click color buttons to change theme
- Toggle widget visibility
- View live widget state (conversation ID, messages count, etc.)

## Running the Examples

### Prerequisites

```bash
# Install Node.js 16+ and npm/yarn
node --version  # v16 or higher

# Install Expo CLI
npm install -g expo-cli
```

### Setup

1. **Clone or copy the SDK to your project:**
   ```bash
   npm install @tryalps/rn-widget
   ```

2. **Get your widget key:**
   - Log in to [Alps Dashboard](https://dashboard.tryalps.com)
   - Go to Settings → API Keys → Widget Key
   - Copy your key

3. **Update example code:**
   - Open the example file (e.g., `basic-app.tsx`)
   - Find `'YOUR_WIDGET_KEY_HERE'`
   - Replace with your actual widget key

4. **Run the app:**
   ```bash
   npx expo start
   ```

5. **Open in Expo Go:**
   - iOS: Open Expo Go app, tap "Scan QR code", scan the terminal QR
   - Android: Open Expo Go app, tap "Scan QR code", scan the terminal QR
   - Web: Press `w` in terminal to open in browser

## Common Patterns

### Get Your Widget Key

```tsx
const config = createAlpsConfig('YOUR_WIDGET_KEY_HERE')
```

See Alps Dashboard → Settings → API Keys → Widget Key

### Pre-fill Visitor Info

```tsx
const config = createAlpsConfig('your-widget-key', {
  visitorName: 'John Doe',
  visitorEmail: 'john@example.com',
})
```

### Show/Hide Widget Programmatically

```tsx
const [visible, setVisible] = useState(false)

<AlpsWidget config={config} visible={visible} onClose={() => setVisible(false)} />
<Button onPress={() => setVisible(true)}>Open Support</Button>
```

### Access Widget State

```tsx
import { useWidgetStore } from '@tryalps/rn-widget'

function MyComponent() {
  const { messages, conversationStatus, ticket } = useWidgetStore()
  return <Text>Messages: {messages.length}</Text>
}
```

### Custom Theme Colors

The widget automatically uses the theme color from your Alps workspace settings. To override:

```tsx
// In your component that renders AlpsWidget:
<AlpsWidget config={config} themeColor="#FF6B35" />
```

## Troubleshooting

### Widget Not Showing

1. **Check widget key:** Verify it's correct from your Alps dashboard
2. **Check internet:** Widget requires network connectivity
3. **Check permissions:** Ensure Camera/Microphone permissions are granted (iOS)
4. **Check console:** Look for errors in Expo debugger (Cmd+D on iOS, Cmd+M on Android)

### "Module not found" Error

```bash
# Make sure dependencies are installed
npm install @tryalps/rn-widget
npm install @react-native-async-storage/async-storage
npm install react-native-webview
```

### Styles Look Wrong

- Widget uses standard React Native styling, not CSS
- Ensure your device is 360px+ wide
- Try clearing Expo cache: `npx expo start --clear`

### Network/API Errors

- Check that `https://api.tryalps.com/api/v1` is accessible
- Verify your widget key is correct
- Check that your app has internet permission

## Performance Tips

1. **Memoize config:** Avoid recreating config on every render
   ```tsx
   const config = useMemo(() => createAlpsConfig('key'), [])
   ```

2. **Lazy load widget:** Load only when needed
   ```tsx
   const AlpsWidget = lazy(() => import('@tryalps/rn-widget'))
   ```

3. **Use production mode:** Expo dev mode is slower; test with `npx expo start --no-dev`

## Testing

### Manual Testing Checklist

- [ ] Launcher button visible (bottom-right, correct color)
- [ ] Tap launcher → modal opens
- [ ] All tabs work (Home, Messages, Answers)
- [ ] Can search articles
- [ ] Can view categories and articles
- [ ] Navigation back button works
- [ ] Pre-chat gate shows for anonymous users
- [ ] Messages persist after reload
- [ ] Closing and reopening widget preserves state

### Automated Testing

Add tests to your `__tests__` folder:

```tsx
import { render } from '@testing-library/react-native'
import BasicApp from '../basic-app'

describe('BasicApp', () => {
  it('renders without crashing', () => {
    render(<BasicApp />)
  })
})
```

## Customization Ideas

### Change launcher position:
```tsx
// Widget renders FAB in bottom-right
// To customize: modify AlpsWidget.tsx and position CSS
```

### Change default colors:
```tsx
import { T } from '@tryalps/rn-widget'
// T.dark, T.panelBg, T.textMid, etc. are available
// Pass as props to customize rendering
```

### Add custom header:
```tsx
<View>
  <MyCustomHeader />
  <AlpsWidget config={config} />
</View>
```

## Support

- **Docs:** [https://docs.tryalps.com](https://docs.tryalps.com)
- **GitHub:** [https://github.com/tryalps/rn-widget](https://github.com/tryalps/rn-widget)
- **Email:** support@tryalps.com
- **Slack:** [Alps Community](https://slack.tryalps.com)

## Next Steps

1. **Choose an example** that matches your use case
2. **Update widget key** from your Alps dashboard
3. **Run locally** to test integration
4. **Customize** styling and behavior as needed
5. **Deploy** to production

Happy building! 🚀
