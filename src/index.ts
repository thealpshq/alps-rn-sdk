// Public API exports - trimmed down after the WebView-wrapper rewrite. Everything this package
// used to also export (Panel, internal state hooks, the API client, response models, design
// tokens, shared UI components) was the old independent reimplementation's own internal plumbing,
// not a real external contract - none of it exists anymore, since the real widget page now owns
// all of that itself. AlpsWidget's own props are unchanged, so this remains a non-breaking
// upgrade for the one thing anyone outside this package should have been depending on.
// Real relative imports, not the '@/*' path alias used elsewhere in this repo - that alias is a
// TypeScript-only, compile-time type-checking convenience (tsconfig.json's `paths`); it is never
// rewritten in emitted JS. A published package's own entry point can't use it, or every consumer
// importing this package would hit an unresolvable '@/...' specifier at runtime.
export { AlpsWidget } from './ui/AlpsWidget'
export { createAlpsConfig, AlpsConfigBuilder } from './config/AlpsConfig'
export type { AlpsConfig } from './config/AlpsConfig'
