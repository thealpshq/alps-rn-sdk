# alps-rn-sdk

Embed the real Alps support widget natively inside a React Native app (iOS + Android) - a thin
wrapper around `react-native-webview` that loads the actual widget UI directly, not a
reimplementation of it. The same chat interface your web widget and customers see, running inside
your own app as a proper native popup, not a webpage loaded behind it.

## Install

Not on the npm registry yet - install directly from GitHub:

```bash
npm install github:thealpshq/alps-rn-sdk
# or
yarn add github:thealpshq/alps-rn-sdk
```

This also needs `react-native-webview` as a peer dependency, if your app doesn't already have it:

```bash
npx expo install react-native-webview
```

## Usage

```tsx
import { AlpsWidget, createAlpsConfig } from 'alps-rn-sdk'
import { useState } from 'react'
import { Button } from 'react-native'

export default function App() {
  const [visible, setVisible] = useState(false)

  const config = createAlpsConfig('your-widget-key', {
    visitorName: 'Jane Doe',
    visitorEmail: 'jane@example.com',
  })

  return (
    <>
      <Button title="Chat with us" onPress={() => setVisible(true)} />
      <AlpsWidget config={config} visible={visible} onClose={() => setVisible(false)} />
    </>
  )
}
```

## API

### `createAlpsConfig(widgetKey, overrides?)`

```ts
interface AlpsConfig {
  widgetKey: string
  visitorName?: string
  visitorEmail?: string
  conversationId?: string
}
```

Or build one incrementally with `AlpsConfigBuilder`:

```ts
import { AlpsConfigBuilder } from 'alps-rn-sdk'

const config = new AlpsConfigBuilder('your-widget-key')
  .setVisitorName('Jane Doe')
  .setVisitorEmail('jane@example.com')
  .build()
```

### `<AlpsWidget />`

| Prop | Type | Description |
|---|---|---|
| `config` | `AlpsConfig` | Required. Widget key + optional visitor identity. |
| `visible` | `boolean` | Controls whether the panel is shown. Omit to manage it with the built-in floating launcher button instead. |
| `onClose` | `() => void` | Called when the panel is dismissed (close button, or the widget's own close signal). |

## How it works

`AlpsWidget` loads `https://cdn.tryalps.com/frame?native=1&widgetKey=...` in a WebView - the real
widget frame, the same one powering the web embed, booted in a mode built for native hosts (no
browser-only `postMessage`/`MessageChannel` handshake, which a native WebView can't provide). Close
events are relayed back through the WebView's own message bridge. There's no separate native chat
UI to keep in sync with the real product - this package is intentionally thin.

## Development

```bash
npm install
npm run build   # compiles src/ -> dist/ (runs automatically on `npm install` via `prepare`)
```
