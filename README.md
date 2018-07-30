# static-store

This package can be used to load values from YAML files under a `$PWD/static-store` directory.

Example use:

In `static-store/ice-cream-flavor`:

```yaml
1: Schwarzwälder Kirschwasser 🍒
2: Millennial-Avocado 🥑
3: Octopus 🐙
```

In `my-file.js`:

```js
require('static-store').iceCreamFlavor[3] // returns "Octopus 🐙"
```

Notes:

- File contents are cached.
- File names are in `kebab-case` 🥙 but in-code proxies are written in `camelCase` 🐫.

## Contributing

Publish to `npm.org` with `yarn release`.
