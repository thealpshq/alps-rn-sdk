// Real gap fixed: this used to also carry `visitorId`, `pusherKey`, `pusherCluster` - all left
// over from the old independent reimplementation (its own API client needed a session id; its own
// Pusher client needed connection keys). Neither applies anymore - the real widget page
// (alps-widget/frame, loaded directly in a WebView now) owns its own identity/storage and its own
// Pusher connection internally, the same as it does for the web embed and the iOS/Android SDKs.
// `visitorId` specifically was never actually working before this: `generateId()` minted a fresh,
// unpersisted id on every single AlpsConfig construction and nothing ever read it back - typed
// but never real.
export interface AlpsConfig {
  widgetKey: string
  visitorName?: string
  visitorEmail?: string
  conversationId?: string
}

export class AlpsConfigBuilder {
  private config: AlpsConfig

  constructor(widgetKey: string) {
    this.config = { widgetKey }
  }

  setVisitorName(name: string): this {
    this.config.visitorName = name
    return this
  }

  setVisitorEmail(email: string): this {
    this.config.visitorEmail = email
    return this
  }

  setConversationId(id: string): this {
    this.config.conversationId = id
    return this
  }

  build(): AlpsConfig {
    return this.config
  }
}

export const createAlpsConfig = (widgetKey: string, overrides?: Partial<AlpsConfig>): AlpsConfig => {
  return {
    widgetKey,
    ...overrides,
  }
}
