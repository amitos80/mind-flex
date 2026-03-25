# MindFlex Content Script

This content script runs on every web page and is responsible for:

1. **DOM Scanning** — walks text nodes to find complex words that meet the minimum length threshold (`dom-scanner.ts`)
2. **Word Injection** — replaces qualifying words with interactive masked spans (`word-injector.ts`)
3. **Mutation Observation** — rescans newly added DOM nodes for SPA-style page updates (`mutation-observer.ts`)
4. **Settings Sync** — listens for messages from the popup to apply difficulty/enabled changes in real-time

## Entry Point

`src/matches/all/index.ts` — runs on all `http://` and `https://` pages.

## Events

The content script dispatches a `mindflex:word-click` custom event on `document` when a masked word span is clicked. The `content-ui` shadow DOM listens for this event to display the choice popover.

## Key Files

| File | Responsibility |
|---|---|
| `src/dom-scanner.ts` | `TreeWalker`-based text node scanner |
| `src/word-injector.ts` | DOM mutation to inject `<span data-mindflex-word>` elements |
| `src/mutation-observer.ts` | Debounced `MutationObserver` for dynamic content |
| `src/matches/all/index.ts` | Wires everything together, handles Chrome messages |
